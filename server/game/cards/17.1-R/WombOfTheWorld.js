import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WombOfTheWorld extends DrawCard {
    // Womb of the World (17132)
    // Action: Kneel Womb of the World to reveal the top 5 cards of your deck. Put an eligible
    // Dothraki character with the lowest printed cost revealed this way into play. Shuffle your
    // deck. At the end of the phase, if that card is still in play, return it to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top 5 cards',
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to reveal the top 5 cards of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player,
                amount: 5,
                whileRevealed: GameActions.chooseCards({
                    title: 'Select a character',
                    cardCondition: (card, context) =>
                        context.revealed.includes(card) &&
                        isEligible(card, context) &&
                        card.getPrintedCost() === lowestPrintedCost(context),
                    gameAction: (card, context) =>
                        GameActions.putIntoPlay({
                            card,
                            player: context.player,
                            dupeIsValid: true
                        }).then({
                            message: {
                                format: '{player} puts {card} into play',
                                args: { card: () => card }
                            },
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

function isEligible(card, context) {
    return (
        card.isMatch({ trait: 'Dothraki', type: 'character' }) &&
        context.player.canPutIntoPlay(card)
    );
}

function lowestPrintedCost(context) {
    return Math.min(
        ...context.revealed
            .filter((card) => isEligible(card, context))
            .map((card) => card.getPrintedCost())
    );
}

WombOfTheWorld.code = '17132';

export default WombOfTheWorld;
