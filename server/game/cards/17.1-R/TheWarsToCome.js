import AgendaCard from '../../agendacard.js';

class TheWarsToCome extends AgendaCard {
    // The Wars To Come (17151)
    // Your plot deck must be exactly 10 cards. You may include a second copy of up to 2 different
    // cards in your plot deck.
    // While there are 3 or more plot cards in your used pile, your non-War plot cards gain Prized
    // 1.
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
