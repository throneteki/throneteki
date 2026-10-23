import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WakingTheDragon extends DrawCard {
    // Waking the Dragon (01178)
    // Action: Choose and stand a unique [targaryen] character you control. At the end of the phase,
    // if that character is still in play, return it to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand a character',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('targaryen') &&
                    card.isUnique() &&
                    card.controller === context.player
            },
            message: '{player} plays {source} to stand {target}',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.lastingEffect((context) => ({
                    duration: 'atEndOfPhase',
                    match: context.target,
                    targetLocation: 'any',
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    effect: ability.effects.returnToHandIfStillInPlay(true)
                }))
            ])
        });
    }
}

WakingTheDragon.code = '01178';

export default WakingTheDragon;
