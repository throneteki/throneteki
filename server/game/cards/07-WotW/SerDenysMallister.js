import DrawCard from '../../drawcard.js';

class SerDenysMallister extends DrawCard {
    // Ser Denys Mallister (07007)
    // While Ser Denys Mallister is defending, he gains renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isDefending(),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

SerDenysMallister.code = '07007';

export default SerDenysMallister;
