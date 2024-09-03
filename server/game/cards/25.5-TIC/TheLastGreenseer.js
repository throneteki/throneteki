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
                activePromptTitle: 'Select a plot',
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
                        ability.effects.setBaseGold(sourceStats.income),
                        ability.effects.setBaseClaim(sourceStats.claim),
                        ability.effects.setBaseReserve(sourceStats.reserve)
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
                        ability.effects.setBaseGold(targetStats.income),
                        ability.effects.setBaseClaim(targetStats.claim),
                        ability.effects.setBaseReserve(targetStats.reserve)
                    ]
                }));
            }
        });
    }
}

TheLastGreenseer.code = '25100';

export default TheLastGreenseer;
