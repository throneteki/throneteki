import DrawCard from '../../drawcard.js';

class SerJacelynBywater extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.canAmbush(
                (card) =>
                    card.controller === this.controller &&
                    card.location === 'discard pile' &&
                    card.getType() === 'character' &&
                    card.isFaction('lannister') &&
                    !card.isUnique()
            )
        });
    }
}

SerJacelynBywater.code = '21008';

export default SerJacelynBywater;
