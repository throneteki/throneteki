import DrawCard from '../../drawcard.js';

class KingRobbsBannermen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) => card.isFaction('stark') && card.hasTrait('King')
                ),
            match: this,
            effect: ability.effects.modifyKeywordTriggerAmount('assault', 1)
        });
    }
}

KingRobbsBannermen.code = '24016';

export default KingRobbsBannermen;
