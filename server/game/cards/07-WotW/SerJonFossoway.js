import DrawCard from '../../drawcard.js';

class SerJonFossoway extends DrawCard {
    // Ser Jon Fossoway (07037)
    // While Ser Jon Fossoway's STR is 5 or higher, he gains renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.getStrength() >= 5,
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

SerJonFossoway.code = '07037';

export default SerJonFossoway;
