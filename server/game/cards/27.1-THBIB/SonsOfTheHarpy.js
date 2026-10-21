import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SonsOfTheHarpy extends DrawCard {
    // Sons of the Harpy (27013)
    // Shadow (2).
    // Reaction: After Sons of the Harpy comes out of shadows, choose a participating character.
    // Until the end of the phase, that character gets -2 STR.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    participating: true
                },
                gameAction: 'decreaseStrength'
            },
            message: '{player} uses {source} to give {target} -2 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.modifyStrength(-2)
            }))
        });
    }
}

SonsOfTheHarpy.code = '27013';

export default SonsOfTheHarpy;
