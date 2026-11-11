import AgendaCard from '../../agendacard.js';

class KnightsOfHollowHill extends AgendaCard {
    // Knights of the Hollow Hill (13039)
    // You cannot place cards during setup. Your other cards do not provide a gold bonus.
    // +3 Income. +2 Initiative. +1 Reserve.
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
            match: (card, context) => card !== context.source && card.getType() !== 'plot',
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

export default KnightsOfHollowHill;
