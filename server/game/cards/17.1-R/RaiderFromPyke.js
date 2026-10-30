import DrawCard from '../../drawcard.js';

class RaiderFromPyke extends DrawCard {
    // Raider from Pyke (17107)
    // Each Item or Weapon card in your hand with printed cost 0 or higher gains ambush (X). X is
    // that card's printed cost.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'hand',
            match: (card, context) =>
                card.getType() === 'attachment' &&
                (card.hasTrait('Weapon') || card.hasTrait('Item')) &&
                card.getPrintedCost() >= 0 &&
                !['-', 'X'].includes(context.source.cardData.cost),
            effect: ability.effects.gainAmbush()
        });
    }
}

RaiderFromPyke.code = '17107';

export default RaiderFromPyke;
