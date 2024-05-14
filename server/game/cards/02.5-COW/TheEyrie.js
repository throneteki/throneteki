import DrawCard from '../../drawcard.js';

class TheEyrie extends DrawCard {
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
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.cannotBeKilled()
                }));

                this.game.addMessage(
                    '{0} kneels {1} to make {2} unkillable until the end of the {3} phase',
                    this.controller,
                    this,
                    context.target,
                    this.game.currentPhase
                );
            }
        });
    }
}

TheEyrie.code = '02098';

export default TheEyrie;
