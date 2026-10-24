import PlotCard from '../../plotcard.js';

class TheBloodyFlux extends PlotCard {
    // The Bloody Flux (11040)
    // Characters cannot be saved.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.getType() === 'character',
            effect: ability.effects.cannotBeSaved()
        });
    }
}

TheBloodyFlux.code = '11040';

export default TheBloodyFlux;
