import DrawCard from '../../drawcard.js';

class SerJaremyRykker extends DrawCard {
    // Ser Jaremy Rykker (07008)
    // No attachments except Weapon.
    // Each other Ranger character you control gains a [power] icon.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card !== this && card.hasTrait('Ranger') && card.getType() === 'character',
            effect: ability.effects.addIcon('power')
        });
    }
}

SerJaremyRykker.code = '07008';

export default SerJaremyRykker;
