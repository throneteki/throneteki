import DrawCard from '../../drawcard.js';

class MargaeryTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character +3 STR',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to give {2} +3 STR until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(3)
                }));
            }
        });
    }
}

MargaeryTyrell.code = '01181';

export default MargaeryTyrell;
