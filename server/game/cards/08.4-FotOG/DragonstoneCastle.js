import DrawCard from '../../drawcard.js';

class DragonstoneCastle extends DrawCard {
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
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.cannotBeStood()
                }));

                this.game.addMessage(
                    '{0} kneels {1} to make {2} unable to stand until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

DragonstoneCastle.code = '08068';

export default DragonstoneCastle;
