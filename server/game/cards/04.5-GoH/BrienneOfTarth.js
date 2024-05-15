import DrawCard from '../../drawcard.js';

class BrienneOfTarth extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) => card.hasTrait('King') || card.name === 'Catelyn Stark'
                ),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender()
        });
    }
}

BrienneOfTarth.code = '04083';

export default BrienneOfTarth;
