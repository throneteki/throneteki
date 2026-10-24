import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DragonstoneCastle extends DrawCard {
    // Dragonstone Castle (08068)
    // Reaction: After a phase begins, kneel Dragonstone Castle to choose a character. Until the end
    // of the phase, that character cannot stand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            cost: ability.costs.kneelSelf(),
            message:
                '{player} kneels {source} to make {target} unable to stand until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.cannotBeStood()
            }))
        });
    }
}

DragonstoneCastle.code = '08068';

export default DragonstoneCastle;
