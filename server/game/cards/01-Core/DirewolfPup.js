import DrawCard from '../../drawcard.js';

class DirewolfPup extends DrawCard {
    // Direwolf Pup (01149)
    // No attachments.
    // Direwolf Pup gets +1 STR for each other Direwolf card you control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card === context.source,
            effect: ability.effects.dynamicStrength((pup) =>
                pup.controller.getNumberOfCardsInPlay(
                    (card) => card !== pup && card.hasTrait('Direwolf')
                )
            )
        });
    }
}

DirewolfPup.code = '01149';

export default DirewolfPup;
