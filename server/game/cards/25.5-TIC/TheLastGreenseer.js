import PlotCard from '../../plotcard.js';

class TheLastGreenseer extends PlotCard {
    setupCardAbilities() {
        const getBaseStats = (card) => {
            return {
                income: card.income.baseValue,
                claim: card.claim.baseValue,
                reserve: card.reserve.baseValue
            };
        };

        this.whenRevealed({
            target: {
                type: 'select',
                cardType: ['plot'],
                cardCondition: {
                    location: 'active plot',
                    type: 'plot',
                    condition: (card, context) => card !== context.source
                }
            },
            message:
                '{player} uses {source} to switch the base gold, claim, and reserve values with {target}',
            handler: (context) => {
                const targetStats = getBaseStats(context.target);
                const sourceStats = getBaseStats(context.source);

                this.lastingEffect((ability) => ({
                    until: {
                        onCardLeftPlay: (event) =>
                            [context.target, context.source].includes(event.card)
                    },
                    match: context.target,
                    targetController: 'any',
                    effect: [
                        ability.effects.setBaseIncome(sourceStats.income),
                        ability.effects.setBaseInitiative(sourceStats.initiative),
                        ability.effects.setBaseClaim(sourceStats.claim)
                    ]
                }));
                this.lastingEffect((ability) => ({
                    until: {
                        onCardLeftPlay: (event) =>
                            [context.target, context.source].includes(event.card)
                    },
                    match: context.source,
                    targetController: 'any',
                    effect: [
                        ability.effects.setBaseIncome(targetStats.income),
                        ability.effects.setBaseInitiative(targetStats.initiative),
                        ability.effects.setBaseClaim(targetStats.claim)
                    ]
                }));
            }
        });
    }
}

TheLastGreenseer.code = '25100';

export default TheLastGreenseer;
