import DrawCard from '../../drawcard.js';

class Left extends DrawCard {
    // Left (01179)
    // No attachments except Weapon.
    // While you control Right, Left gets +1 STR, gains a [power] icon, and does not kneel when
    // declared as a defender.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay((card) => card.name === 'Right'),
            match: this,
            effect: [
                ability.effects.modifyStrength(1),
                ability.effects.addIcon('power'),
                ability.effects.doesNotKneelAsDefender()
            ]
        });
    }
}

Left.code = '01179';

export default Left;
