import PlotCard from '../../plotcard.js';

class LoanFromTheIronBank extends PlotCard {
    // Loan from the Iron Bank (15051)
    // While Loan from the Iron Bank is in your used pile, reduce the gold value on your revealed
    // plot by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) => context.source.location === 'revealed plots',
            match: (card) => card === card.controller.activePlot,
            targetController: 'current',
            effect: ability.effects.modifyGold(-1)
        });
    }
}

LoanFromTheIronBank.code = '15051';

export default LoanFromTheIronBank;
