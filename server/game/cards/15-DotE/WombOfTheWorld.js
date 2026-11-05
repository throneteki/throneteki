import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WombOfTheWorld extends DrawCard {
    // Womb of the World (15017)
    // Action: Kneel Womb of the World to reveal the top 5 cards of your deck. You may chose a
    // Dothraki character revealed this way and put it into play. Shuffle your deck. At the end of
    // the phase, if that character is still in play, return it to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top 5 cards',
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to reveal the top 5 cards of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player,
                amount: 5,
                whileRevealed: GameActions.chooseCards({
                    optional: true,
                    title: 'Select a character',
                    cardCondition: (card, context) =>
                        context.revealed.includes(card) &&
                        card.isMatch({ trait: 'Dothraki', type: 'character' }),
                    gameAction: (card, context) =>
                        GameActions.putIntoPlay({ card, player: context.player }).then({
                            gameAction: GameActions.delayedEffect(() => {
                                return {
                                    duration: 'untilTriggered',
                                    title: card.name,
                                    when: { onAtEndOfPhase: () => true },
                                    until: { onCardLeftPlay: (event) => event.card === card },
                                    gameAction: GameActions.ifCondition({
                                        condition: () =>
                                            ['play area', 'duplicate'].includes(card.location),
                                        thenAction: {
                                            message:
                                                '{player} resolves the delayed effect from {source}: {gameAction}',
                                            gameAction: GameActions.returnCardToHand({
                                                card,
                                                allowSave: true
                                            })
                                        }
                                    })
                                };
                            })
                        })
                })
            })).then({
                message: '{player} shuffles their deck',
                gameAction: GameActions.shuffle((context) => ({ player: context.player }))
            })
        });
    }
}

WombOfTheWorld.code = '15017';

export default WombOfTheWorld;
