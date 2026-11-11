import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Lionstar extends DrawCard {
    // Lionstar (14028)
    // Action: Kneel Lionstar to put a [lannister] character with printed cost 4 or lower into play
    // from your hand. At the end of the phase, if that card is still in play, discard it from play.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put a character into play',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    card.isFaction('lannister') &&
                    context.source.controller.canPutIntoPlay(card) &&
                    card.getPrintedCost() <= 4
            },
            message: '{player} kneels {source} to put {target} into play',
            gameAction: GameActions.simultaneously([
                GameActions.putIntoPlay((context) => ({
                    player: context.player,
                    card: context.target
                })),
                GameActions.delayedEffect((context) => {
                    const card = context.target;
                    return {
                        duration: 'untilTriggered',
                        title: card.name,
                        when: { onAtEndOfPhase: () => true },
                        until: { onCardLeftPlay: (event) => event.card === card },
                        gameAction: GameActions.ifCondition({
                            condition: () => ['play area', 'duplicate'].includes(card.location),
                            thenAction: {
                                message:
                                    '{player} resolves the delayed effect from {source}: {gameAction}',
                                gameAction: GameActions.discardCard({ card, allowSave: false })
                            }
                        })
                    };
                })
            ])
        });
    }
}

Lionstar.code = '14028';

export default Lionstar;
