import DrawCard from '../../drawcard.js';

class AlyceGraceford extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give renown',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('The Seven')
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('renown')
                }));

                this.game.addMessage(
                    '{0} kneels {1} to give {2} renown until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

AlyceGraceford.code = '13063';

export default AlyceGraceford;
