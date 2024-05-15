import DrawCard from '../../drawcard.js';

class KnightsOfTheSun extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.getNumberOfUsedPlots() >= 3,
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

KnightsOfTheSun.code = '02095';

export default KnightsOfTheSun;
