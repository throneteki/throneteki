const AgendaCard = require('../../agendacard');

class KnightsOfHollowHill extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.cannotSetup()
        });

        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.cannotSetupIntoShadows()
        });

        this.persistentEffect({
            match: (card) => card !== this && card.getType() !== 'plot',
            targetController: 'current',
            effect: ability.effects.preventPlotModifier('gold')
        });

        this.plotModifiers({
            gold: 3,
            initiative: 2,
            reserve: 1
        });
    }
}

KnightsOfHollowHill.code = '13039';

module.exports = KnightsOfHollowHill;
