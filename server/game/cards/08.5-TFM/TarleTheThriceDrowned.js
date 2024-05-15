import DrawCard from '../../drawcard.js';

class TarleTheThriceDrowned extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.canMarshal(
                (card) =>
                    card.controller === this.controller &&
                    card.location === 'dead pile' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Drowned God') &&
                    !card.isUnique()
            )
        });
    }
}

TarleTheThriceDrowned.code = '08091';

export default TarleTheThriceDrowned;
