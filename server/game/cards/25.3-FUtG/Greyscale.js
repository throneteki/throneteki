import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';
import Message from '../../Message.js';

class Greyscale extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal from hand',
            phase: 'dominance',
            cost: ability.costs.kneelSelf(),
            chooseOpponent: (player) => player.hand.length > 0,
            message: "{player} kneels {source} to reveal a card at random from {opponent}'s hand",
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.revealCards((context) => ({
                        cards: [
                            context.opponent.hand[
                                Math.floor(Math.random() * context.opponent.hand.length)
                            ]
                        ],
                        player: context.opponent
                    })).then({
                        gameAction: GameActions.ifCondition({
                            condition: (context) =>
                                context.parentContext.revealed[0].hasPrintedCost() &&
                                this.parent.hasPrintedCost() &&
                                context.parentContext.revealed[0].getPrintedCost() >=
                                    this.parent.getPrintedCost(),
                            thenAction: {
                                gameAction: GameActions.genericHandler((context) => {
                                    let bonuses = this.satisfiableBonuses(context);
                                    if (bonuses.length > 0) {
                                        if (bonuses.includes('attach')) {
                                            this.game.promptForSelect(context.player, {
                                                activePromptTitle: 'Select a character',
                                                cardCondition: (card) =>
                                                    this.canAttachToCharacter(context, card),
                                                onSelect: (player, card) =>
                                                    this.activateBonuses(context, bonuses, card),
                                                onCancel: () =>
                                                    this.activateBonuses(context, bonuses, null),
                                                source: this
                                            });
                                            return;
                                        }

                                        this.activateBonuses(context, bonuses, null);
                                    }
                                })
                            },
                            elseAction: {
                                message: {
                                    format: 'Then, {opponent} draws 1 card',
                                    args: { opponent: (context) => context.parentContext.opponent }
                                },
                                gameAction: GameActions.drawCards((context) => ({
                                    player: context.parentContext.opponent,
                                    amount: 1
                                }))
                            }
                        })
                    }),
                    context
                );
            }
        });
    }

    canAttachToCharacter(context, card) {
        return (
            card.getType() === 'character' &&
            card !== this.parent &&
            context.player.canAttach(this, card)
        );
    }

    satisfiableBonuses(context) {
        let satisfiable = [];
        if (GameActions.kill({ card: this.parent }).allow()) {
            satisfiable.push('kill');
        }
        if (context.game.anyCardsInPlay((card) => this.canAttachToCharacter(context, card))) {
            satisfiable.push('attach');
        }
        return satisfiable;
    }

    activateBonuses(context, bonuses, attachTo) {
        let bonusMessages = [];
        let gameActions = [];

        if (bonuses.includes('kill')) {
            gameActions.push(GameActions.kill({ card: this.parent }));
            bonusMessages.push(Message.fragment('kill {parent}', { parent: this.parent }));
        }

        if (bonuses.includes('attach') && attachTo) {
            gameActions.push(
                GameActions.genericHandler(() => {
                    context.player.attach(context.player, this, attachTo);
                })
            );
            bonusMessages.push(
                Message.fragment('attach {source} to {attachTo}', { source: this, attachTo })
            );
        }

        this.game.addMessage('Then, {0} uses {1} to {2}', context.player, this, bonusMessages);
        // Reverse to ensure "attach" happens first, if applicable
        this.game.resolveGameAction(GameActions.simultaneously(gameActions.reverse()));
        return true;
    }
}

Greyscale.code = '25059';

export default Greyscale;
