import DrawCard from '../../drawcard.js';

class DothrakiOutriders extends DrawCard {
    // Dothraki Outriders (02074)
    // No attachments. Pillage.
    // Reduce the cost to marshal Dothraki Outriders by 1 for each Dothraki character you control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('marshal', (card) =>
                card.controller.getNumberOfCardsInPlay(
                    (character) =>
                        character.hasTrait('Dothraki') && character.getType() === 'character'
                )
            )
        });
    }
}

DothrakiOutriders.code = '02074';

export default DothrakiOutriders;
