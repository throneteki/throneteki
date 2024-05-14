const PlotCard = require('../../plotcard');

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

module.exports = LoanFromTheIronBank;
