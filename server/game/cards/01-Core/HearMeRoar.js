import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HearMeRoar extends DrawCard {
    // Hear Me Roar! (01100)
    // Action: Put a [lannister] character into play from your hand. At the end of the phase, if
    // that card is still in play, discard it from play (cannot be saved).
    setupCardAbilities(ability) {
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
                GameActions.lastingEffect((context) => ({
                    duration: 'atEndOfPhase',
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.discardIfStillInPlay(false)
                }))
            ])
        });
    }
}

HearMeRoar.code = '01100';

export default HearMeRoar;
