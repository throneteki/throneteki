import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Confinement extends DrawCard {
    // Confinement (01121)
    // Action: Choose a character with STR 4 or lower. Until the end of the phase, that character
    // loses a [military], an [intrigue], and a [power] icon.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove icons from character',
            target: {
                cardCondition: (card, context) => context.source.cardCondition(card)
            },
            message:
                '{player} plays {source} to remove a military, an intrigue and a power from {target} until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: [
                    ability.effects.removeIcon('military'),
                    ability.effects.removeIcon('intrigue'),
                    ability.effects.removeIcon('power')
                ]
            }))
        });
    }

    cardCondition(card) {
        return (
            card.location === 'play area' &&
            card.getType() === 'character' &&
            card.getStrength() <= 4
        );
    }
}

Confinement.code = '01121';

export default Confinement;
