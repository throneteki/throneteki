import DrawCard from '../../drawcard.js';

class SerCletusYronwood extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card === card.controller.activePlot,
            effect: ability.effects.modifyInitiative(() => this.controller.getNumberOfUsedPlots())
        });
    }
}

SerCletusYronwood.code = '10012';

export default SerCletusYronwood;
