import AgendaCard from '../../agendacard.js';

class BannerOfTheFalcon extends AgendaCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -2,
            reserve: 1
        });

        this.persistentEffect({
            condition: () =>
                this.controller.filterCardsInPlay((card) => card.hasTrait('House Arryn')).length >
                this.controller.getTotalInitiative(),
            match: (card) =>
                card.controller === this.controller &&
                card.getType() === 'character' &&
                card.isLoyal(),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

BannerOfTheFalcon.code = '23040';

export default BannerOfTheFalcon;
