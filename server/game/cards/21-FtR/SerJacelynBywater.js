import DrawCard from '../../drawcard.js';

class SerJacelynBywater extends DrawCard {
    // Ser Jacelyn Bywater (21008)
    // Ambush (5).
    // You may ambush non-unique [lannister] characters from your discard pile as if they were in
    // your hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.canAmbush(
                (card, context) =>
                    card.controller === context.source.controller &&
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
