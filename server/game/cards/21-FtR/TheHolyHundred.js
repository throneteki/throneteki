import DrawCard from '../../drawcard.js';

class TheHolyHundred extends DrawCard {
    // The Holy Hundred (21002)
    // Assault. No attachments except Weapon.
    // Each The Seven character you control gets +1 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' &&
                card.hasTrait('The Seven') &&
                card.controller === this.controller,
            effect: ability.effects.modifyStrength(1)
        });
    }
}

TheHolyHundred.code = '21002';

export default TheHolyHundred;
