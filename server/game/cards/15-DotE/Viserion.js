import DrawCard from '../../drawcard.js';

class Viserion extends DrawCard {
    // Viserion (15004)
    // No attachments.
    // Each Stormborn character you control gains stealth.
    // While Viserion is attacking, each participating non-Dragon, non-Stormborn characters gets -2
    // STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Stormborn'),
            effect: ability.effects.addKeyword('Stealth')
        });

        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: (card) =>
                card.isParticipating() &&
                card.getType() === 'character' &&
                !card.hasTrait('Dragon') &&
                !card.hasTrait('Stormborn'),
            targetController: 'any',
            effect: ability.effects.modifyStrength(-2)
        });
    }
}

Viserion.code = '15004';

export default Viserion;
