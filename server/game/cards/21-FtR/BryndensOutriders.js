import DrawCard from '../../drawcard.js';

class BryndensOutriders extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay((card) => card.hasTrait('Commander')),
            match: this,
            effect: ability.effects.addIcon('power')
        });

        this.persistentEffect({
            condition: () =>
                this.controller.anyCardsInPlay((card) => card.hasTrait('The Riverlands')),
            match: this,
            effect: ability.effects.addKeyword('stealth')
        });
    }
}

BryndensOutriders.code = '21017';

export default BryndensOutriders;
