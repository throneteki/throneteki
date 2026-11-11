import DrawCard from '../../drawcard.js';

class SerJaremyRykker extends DrawCard {
    // Ser Jaremy Rykker (07008)
    // No attachments except Weapon.
    // Each other Ranger character you control gains a [power] icon.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card !== context.source &&
                card.hasTrait('Ranger') &&
                card.getType() === 'character',
            effect: ability.effects.addIcon('power')
        });
    }
}

SerJaremyRykker.code = '07008';

export default SerJaremyRykker;
