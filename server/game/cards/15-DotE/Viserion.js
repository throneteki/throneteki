import DrawCard from '../../drawcard.js';

class Viserion extends DrawCard {
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
