import AgendaCard from '../../agendacard.js';

class TheWarsToCome extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.getNumberOfUsedPlots() >= 3,
            match: (card) => card.getType() === 'plot' && !card.hasTrait('War'),
            effect: ability.effects.addKeyword('Prized 1')
        });
    }
}

TheWarsToCome.code = '17151';

export default TheWarsToCome;
