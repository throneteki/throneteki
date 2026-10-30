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
            effect: ability.effects.dynamicStrength(
                (card, context) => context.source.parent.attachments.length
            )
        });

        this.persistentEffect({
            condition: (context) =>
                context.source.parent && context.source.parent.isParticipating(),
            match: (card) => card.getType() === 'character' && card.attachments.length === 0,
            targetController: 'any',
            effect: ability.effects.cannotGainPower()
        });
    }
}

Tokar.code = '09038';

export default Tokar;
