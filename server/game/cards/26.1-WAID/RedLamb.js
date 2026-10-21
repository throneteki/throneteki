import DrawCard from '../../drawcard.js';

class RedLamb extends DrawCard {
    // Red Lamb (26013)
    // While you control Ser Barristan Selmy, Red Lamb gains a [power] icon and the Knight trait.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.controller.anyCardsInPlay({ name: 'Ser Barristan Selmy' }),
            match: this,
            effect: [ability.effects.addIcon('power'), ability.effects.addTrait('knight')]
        });
    }
}

RedLamb.code = '26013';

export default RedLamb;
