import DrawCard from '../../drawcard.js';

class SerParmenCrane extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) =>
                        card !== this &&
                        card.getType() === 'character' &&
                        card.hasTrait('Rainbow Guard')
                ),
            match: this,
            effect: ability.effects.addKeyword('renown')
        });
    }
}

SerParmenCrane.code = '25035';

export default SerParmenCrane;
