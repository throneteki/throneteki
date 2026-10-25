import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheLastGreenseer extends PlotCard {
    // The Last Greenseer (25100)
    // When Revealed: Switch the base gold, claim, and reserve values on The Last Greenseer with
    // those values on another revealed plot card until either card leaves play.
    setupCardAbilities(ability) {
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
            gameAction: GameActions.simultaneously((context) => {
                const plots = [context.target, context.source];
                return plots.map((plot, index) => {
                    const stats = getBaseStats(plots[1 - index]);
                    return GameActions.lastingEffect(() => ({
                        duration: 'custom',
                        until: {
                            onCardLeftPlay: (event) => plots.includes(event.card),
                            'onCardLeftPlay:reaction': (event) => plots.includes(event.card)
                        },
                        match: plot,
                        targetController: 'any',
                        effect: [
                            ability.effects.setBaseGold(stats.income),
                            ability.effects.setBaseClaim(stats.claim),
                            ability.effects.setBaseReserve(stats.reserve)
                        ]
                    }));
                });
            })
        });
    }
}

function getBaseStats(card) {
    return {
        income: card.income.baseValue,
        claim: card.claim.baseValue,
        reserve: card.reserve.baseValue
    };
}

TheLastGreenseer.code = '25100';

export default TheLastGreenseer;
