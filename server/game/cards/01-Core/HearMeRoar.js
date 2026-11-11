import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HearMeRoar extends DrawCard {
    // Hear Me Roar! (01100)
    // Action: Put a [lannister] character into play from your hand. At the end of the phase, if
    // that card is still in play, discard it from play (cannot be saved).
    setupCardAbilities() {
        this.action({
            title: 'Put character into play',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    card.isFaction('lannister') &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message: '{player} plays {source} to put {target} into play from their hand',
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

HearMeRoar.code = '01100';

export default HearMeRoar;
