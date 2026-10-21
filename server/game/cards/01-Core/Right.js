import DrawCard from '../../drawcard.js';

class Right extends DrawCard {
    // Right (01184)
    // No attachments except Weapon.
    // While you control Left, Right gets +1 STR, gains an [intrigue] icon, and does not kneel when
    // declared as a defender.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.controller.anyCardsInPlay((card) => card.name === 'Left'),
            match: this,
            effect: [
                ability.effects.modifyStrength(1),
                ability.effects.addIcon('intrigue'),
                ability.effects.doesNotKneelAsDefender()
            ]
        });
    }
}

Right.code = '01184';

export default Right;
