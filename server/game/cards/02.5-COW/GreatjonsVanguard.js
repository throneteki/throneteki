import DrawCard from '../../drawcard.js';

class GreatjonsVanguard extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.getNumberOfUsedPlots() <= 2,
            match: this,
            effect: [ability.effects.modifyStrength(2), ability.effects.addKeyword('Renown')]
        });
    }
}

GreatjonsVanguard.code = '02081';

export default GreatjonsVanguard;
