import DrawCard from '../../drawcard.js';

class TheHolyHundred extends DrawCard {
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
