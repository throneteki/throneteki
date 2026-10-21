import AgendaCard from '../../agendacard.js';

class BannerOfTheFalcon extends AgendaCard {
    // Banner of the Falcon (23040)
    // You must include at least 12 House Arryn cards in your deck.
    // While the number of House Arryn cards you control is higher than your initiative value, each
    // loyal character you control gets +1 STR.
    // -2 Initiative. +1 Reserve.
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -2,
            reserve: 1
        });

        this.persistentEffect({
            condition: () =>
                this.controller.filterCardsInPlay((card) => card.hasTrait('House Arryn')).length >
                this.controller.getInitiative(),
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
