import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Greyscale extends DrawCard {
    // Greyscale (25059)
    // Terminal.
    // Dominance Action: Kneel Greyscale to choose an opponent and reveal 1 card at random from
    // their hand. If that card’s printed cost is equal to or higher than attached character’s, kill
    // attached character and attach Greyscale to a different character. Otherwise, that player
    // draws 1 card.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal from hand',
            phase: 'dominance',
            cost: ability.costs.kneelSelf(),
            chooseOpponent: (player) => player.hand.length > 0,
            message: "{player} kneels {source} to reveal a card at random from {opponent}'s hand",
            gameAction: GameActions.revealCards((context) => ({
                cards: [
                    context.opponent.hand[Math.floor(Math.random() * context.opponent.hand.length)]
                ],
                player: context.opponent
            })).then({
                gameAction: GameActions.ifCondition({
                    condition: (context) => {
                        const revealed = context.parentContext.revealed[0];
                        const parent = context.source.parent;
                        return (
                            revealed.hasPrintedCost() &&
                            parent.hasPrintedCost() &&
                            revealed.getPrintedCost() >= parent.getPrintedCost()
                        );
                    },
                    thenAction: {
                        message:
                            'Then {player} uses {source} to kill the attached character and attach it to a different character',
                        gameAction: GameActions.simultaneously((context) => {
                            const parent = context.source.parent;
                            const kill = GameActions.kill({ card: parent });
                            return [
                                GameActions.ifCondition({
                                    condition: () =>
                                        context.game
                                            .filterCardsInPlay(
                                                (card) => card.getType() === 'character'
                                            )
                                            .some((card) =>
                                                GameActions.attach({
                                                    player: context.player,
                                                    attachment: context.source,
                                                    target: card
                                                }).allow(context)
                                            ),
                                    thenAction: GameActions.chooseCards({
                                        title: 'Select a character',
                                        cardCondition: (card) =>
                                            card.getType() === 'character' && card !== parent,
                                        gameAction: (card) =>
                                            GameActions.attach({
                                                player: context.player,
                                                attachment: context.source,
                                                target: card
                                            })
                                    }).then({ gameAction: kill }),
                                    elseAction: kill
                                })
                            ];
                        })
                    },
                    elseAction: {
                        message: {
                            format: 'Then {opponent} draws 1 card',
                            args: { opponent: (context) => context.parentContext.opponent }
                        },
                        gameAction: GameActions.drawCards((context) => ({
                            player: context.parentContext.opponent,
                            amount: 1
                        }))
                    }
                })
            })
        });
    }
}

Greyscale.code = '25059';

export default Greyscale;
