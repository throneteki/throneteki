const PlotCard = require('../../plotcard');

class TheLastGreenseer extends PlotCard {
    setupCardAbilities() {
        const getPrintedStats = card => {
            return {
                income: card.getPrintedIncome(),
                claim: card.getPrintedClaim(),
                reserve: card.getPrintedReserve()
            };
        };

        this.whenRevealed({
            target: {
                type: 'select',
                cardType: ['plot'],
                cardCondition: { location: 'active plot', type: 'plot', condition: (card, context) => card !== context.source }
            },
            message: '{player} uses {source} to swap printed gold, claim, and reserve values with {target}',
            handler: context => {
                const targetStats = getPrintedStats(context.target);
                const sourceStats = getPrintedStats(context.source);

                this.lastingEffect(ability => ({
                    until: {
                        onCardEntersPlay: event => event.card.getType() === 'plot' && event.card.controller === context.player
                    },
                    match: context.target,
                    targetController: 'any',
                    effect: Object.entries(sourceStats).map(([stat, value]) => ability.effects.setPrintedValue(stat, value))
                }));
                this.lastingEffect(ability => ({
                    until: {
                        onCardEntersPlay: event => event.card.getType() === 'plot' && event.card.controller === context.player
                    },
                    match: context.source,
                    targetController: 'any',
                    effect: Object.entries(targetStats).map(([stat, value]) => ability.effects.setPrintedValue(stat, value))
                }));
            }
        });
    }
}

TheLastGreenseer.code = '25616';
TheLastGreenseer.version = '1.0';

module.exports = TheLastGreenseer;
