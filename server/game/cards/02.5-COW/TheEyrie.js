import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheEyrie extends DrawCard {
    // The Eyrie (02098)
    // Reaction: After a phase begins, kneel The Eyrie to choose a character. Until the end of the
    // phase, that character cannot be killed.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message: {
                format: '{player} kneels {source} to make {target} unkillable until the end of the {currentPhase} phase',
                args: { currentPhase: (context) => context.game.currentPhase }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.cannotBeKilled()
            }))
        });
    }
}

TheEyrie.code = '02098';

export default TheEyrie;
