import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class EdricStorm extends DrawCard {
    // Edric Storm (05025)
    // Reaction: After the dominance phase begins, choose a character. That character does not
    // contribute its STR to its controller's total for dominance this phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'dominance'
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message:
                "{player} uses {source} to exclude {target}'s strength from dominance this phase",
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.doesNotContributeToDominance()
            }))
        });
    }
}

EdricStorm.code = '05025';

export default EdricStorm;
