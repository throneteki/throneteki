import PlotCard from '../../plotcard.js';

class TheMaiden extends PlotCard {
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
