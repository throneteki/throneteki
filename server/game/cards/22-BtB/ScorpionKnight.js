import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ScorpionKnight extends DrawCard {
    // Scorpion Knight (22011)
    // Reaction: After a character loses a challenge icon, Scorpion Knight gets +1 STR until the end
    // of the phase. (Limit 3 times per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onIconLost: (event) => event.applying
            },
            limit: ability.limit.perPhase(3),
            message: '{player} uses {source} to gain +1 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.source,
                effect: ability.effects.modifyStrength(1)
            }))
        });
    }
}

ScorpionKnight.code = '22011';

export default ScorpionKnight;
