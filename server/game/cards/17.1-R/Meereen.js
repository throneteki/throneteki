import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Meereen extends DrawCard {
    // Meereen (17133)
    // Action: Kneel Meereen and discard 1 card from your hand to place each card in your hand
    // facedown under Meereen and draw 3 cards. At the end of the phase, or if Meereen leaves play,
    // discard your hand and return each card you placed under Meereen to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Place hand facedown and draw 3',
            cost: [ability.costs.kneelSelf(), ability.costs.discardFromHand()],
            message:
                '{player} kneels {source} and discards 1 card from their hand to place their hand facedown under {source}',
            gameAction: GameActions.simultaneously([
                GameActions.simultaneously((context) =>
                    context.player.hand.map((card) =>
                        GameActions.placeCardUnderneath({
                            card,
                            player: context.player,
                            parentCard: context.source,
                            facedown: true
                        })
                    )
                ),
                GameActions.delayedEffect((context) => {
                    const player = context.player;
                    const source = context.source;
                    return {
                        duration: 'untilTriggered',
                        title: `Return cards to ${player.name}`,
                        when: {
                            onAtEndOfPhase: () => true,
                            onCardLeftPlay: (event) => event.card === source
                        },
                        gameAction: GameActions.simultaneously(() => [
                            ...player.hand.map((card) => GameActions.discardCard({ card })),
                            ...source.underneath
                                .filter((card) => card.owner === player)
                                .map((card) => GameActions.addToHand({ card }))
                        ]),
                        message:
                            '{player} discards their hand and returns their cards from under {source}'
                    };
                })
            ]).then({
                message: 'Then {player} draws 3 cards',
                gameAction: GameActions.drawCards((context) => ({
                    player: context.player,
                    amount: 3
                }))
            })
        });
    }
}

Meereen.code = '17133';

export default Meereen;
