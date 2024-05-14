import PlotCard from '../../plotcard.js';

class LoanFromTheIronBank extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () => this.location === 'revealed plots',
            match: (card) => card === card.controller.activePlot,
            targetController: 'current',
            effect: ability.effects.modifyGold(-1)
        });
    }
}

LoanFromTheIronBank.code = '15051';

export default LoanFromTheIronBank;
