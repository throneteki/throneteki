import DrawCard from '../../drawcard.js';

class KingRobbsBannermen extends DrawCard {
    // King Robb's Bannermen (24016)
    // Assault. No attachments except Direwolf.
    // While you control a [stark] King character, King Robb’s Bannermen may target an additional
    // location using assault.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.controller.anyCardsInPlay(
                    (card) => card.isFaction('stark') && card.hasTrait('King')
                ),
            match: this,
            effect: ability.effects.modifyKeywordTriggerAmount('assault', 1)
        });
    }
}

KingRobbsBannermen.code = '24016';

export default KingRobbsBannermen;
