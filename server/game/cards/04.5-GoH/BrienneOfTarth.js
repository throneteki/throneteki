import DrawCard from '../../drawcard.js';

class BrienneOfTarth extends DrawCard {
    // Brienne of Tarth (04083)
    // Renown.
    // While you control a King character or Catelyn Stark, Brienne of Tarth does not kneel when
    // declared as a defender.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.controller.anyCardsInPlay(
                    (card) =>
                        card.getType() === 'character' &&
                        (card.hasTrait('King') || card.name === 'Catelyn Stark')
                ),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender()
        });
    }
}

BrienneOfTarth.code = '04083';

export default BrienneOfTarth;
