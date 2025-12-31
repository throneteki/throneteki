import DrawCard from '../../drawcard.js';

class PaxterRedwyne extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.controller === this.controller
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.isFaction('tyrell')
            },
            limit: ability.limit.perRound(3),
            message: '{player} uses {source} to give {target} +2 STR until the end of the phase',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(2)
                }));
            }
        });
    }
}

PaxterRedwyne.code = '27585';
PaxterRedwyne.version = '1.0.0';

export default PaxterRedwyne;
