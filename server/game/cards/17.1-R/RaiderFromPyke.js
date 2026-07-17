import DrawCard from '../../drawcard.js';

class RaiderFromPyke extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'hand',
            match: (card) =>
                card.getType() === 'attachment' &&
                (card.hasTrait('Weapon') || card.hasTrait('Item')) &&
                card.getPrintedCost() >= 0 &&
                !['-', 'X'].includes(this.cardData.cost),
            effect: ability.effects.gainAmbush()
        });
    }
}

RaiderFromPyke.code = '17107';

export default RaiderFromPyke;
