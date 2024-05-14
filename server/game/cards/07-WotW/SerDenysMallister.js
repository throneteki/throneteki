import DrawCard from '../../drawcard.js';

class SerDenysMallister extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isDefending(),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

SerDenysMallister.code = '07007';

export default SerDenysMallister;
