import PlotCard from '../../plotcard.js';

class TheMaiden extends PlotCard {
    // The Maiden (20056)
    // While The Maiden is in your used pile, increase the initiative value on your revealed plot
    // card by 2, and the reserve value on your revealed The Seven plot card by 2.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () => this.location === 'revealed plots',
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyInitiative(2)
        });

        this.persistentEffect({
            location: 'any',
            condition: () => this.location === 'revealed plots',
            match: (card) => card === this.controller.activePlot && card.hasTrait('The Seven'),
            effect: ability.effects.modifyReserve(2)
        });
    }
}

TheMaiden.code = '20056';

export default TheMaiden;
