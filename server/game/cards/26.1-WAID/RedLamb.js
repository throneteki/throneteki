import DrawCard from '../../drawcard.js';

class RedLamb extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay({ name: 'Ser Barristan Selmy' }),
            match: this,
            effect: [ability.effects.addIcon('power'), ability.effects.addTrait('knight')]
        });
    }
}

RedLamb.code = '26013';

export default RedLamb;
