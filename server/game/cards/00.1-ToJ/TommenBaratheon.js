import DrawCard from '../../drawcard.js';

class TommenBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.kneeled,
            match: this,
            effect: ability.effects.contributesToDominanceWhileKneeling()
        });
        this.persistentEffect({
            condition: () => this.getNumberOfCats() >= 1,
            match: this,
            effect: ability.effects.addIcon('intrigue')
        });
        this.persistentEffect({
            condition: () => this.getNumberOfCats() >= 2,
            match: this,
            effect: ability.effects.addKeyword('insight')
        });
        this.persistentEffect({
            condition: () => this.getNumberOfCats() >= 3,
            match: this,
            effect: ability.effects.modifyStrength(3)
        });
    }

    getNumberOfCats() {
        return this.controller.getNumberOfCardsInPlay((card) => card.hasTrait('Cat'));
    }
}

TommenBaratheon.code = '00153';

export default TommenBaratheon;
