const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class Greyscale extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal from hand',
            phase: 'dominance',
            cost: ability.costs.kneelSelf(),
            chooseOpponent: player => player.hand.length > 0,
            message: '{player} kneels {source} to reveal a card at random from {opponent}\'s hand',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.revealCards(context => ({
                        cards: [this.getCardAtRandomFromHand(context.opponent)],
                        player: context.opponent
                    })).then({
                        gameAction: GameActions.ifCondition({
                            condition: context => context.parentContext.revealed[0].hasPrintedCost() && this.parent.hasPrintedCost() && context.parentContext.revealed[0].getPrintedCost() >= this.parent.getPrintedCost(),
                            thenAction: {
                                message: {
                                    format: 'Then, {player} kills {parent} and attaches {source} to another eligible character',
                                    args: { parent: context => context.cardStateWhenInitiated.parent }
                                },
                                gameAction: GameActions.simultaneously([
                                    GameActions.ifCondition({
                                        condition: context => context.game.anyCardsInPlay(card => this.allowMoveAttachment(card)),
                                        thenAction: GameActions.genericHandler(context => {
                                            // TODO: Fix this - currently it cannot simultaneously move whilst the attached character is also being killed, and is instead returned to hand 
                                            context.game.promptForSelect(context.player, {
                                                activePromptTitle: 'Select a character',
                                                source: this,
                                                cardCondition: card => this.allowMoveAttachment(card),
                                                onSelect: (player, card) => this.onCardSelected(player, card)
                                            });
                                        })
                                    }),
                                    GameActions.kill(context => ({ card: context.cardStateWhenInitiated.parent }))
                                ])
                            },
                            elseAction: {
                                message: 'Then, {player} draws 1 card',
                                gameAction: GameActions.drawCards(context => ({
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

    getCardAtRandomFromHand(player) {
        var cardIndex = Math.floor(Math.random() * player.hand.length);
        return player.hand[cardIndex];
    }

    allowMoveAttachment(card) {
        return card !== this.parent && this.controller.canAttach(this, card);
    }

    onCardSelected(player, card) {
        player.attach(player, this, card);
        return true;
    }
}

Greyscale.code = '25607';
Greyscale.version = '1.0';

module.exports = Greyscale;