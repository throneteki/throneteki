import DrawCard from '../../drawcard.js';

class KnightsOfTheSun extends DrawCard {
    // Knights of the Sun (02095)
    // No attachments except Weapon.
    // While there are 3 or more plot cards in your used pile, Knights of the Sun gains renown.
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
