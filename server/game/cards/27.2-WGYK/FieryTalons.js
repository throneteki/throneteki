import DrawCard from '../../drawcard.js';

class FieryTalons extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character -1 STR',
            cost: ability.costs.kneel(
                (card) => card.hasTrait("R'hllor") && card.getType() === 'character'
            ),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isParticipating()
            },
            message:
                '{player} kneels {costs.kneel} to give {target} -1 STR until the end of the phase, placing it in shadows if its STR is 0',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.putInShadowsByStrength(-1)
                }));
            }
        });
    }
}

FieryTalons.code = '27022';

export default FieryTalons;
