import DrawCard from '../../drawcard.js';

class Tokar extends DrawCard {
    // Tokar (09038)
    // [targaryen] character only.
    // Attached character gets +1 STR for each attachment it has.
    // While attached character is participating in a challenge, each character without attachments
    // cannot gain power.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen' });

        this.whileAttached({
            effect: ability.effects.dynamicStrength(() => this.parent.attachments.length)
        });

        this.persistentEffect({
            condition: () => this.parent && this.parent.isParticipating(),
            match: (card) => card.getType() === 'character' && card.attachments.length === 0,
            targetController: 'any',
            effect: ability.effects.cannotGainPower()
        });
    }
}

Tokar.code = '09038';

export default Tokar;
