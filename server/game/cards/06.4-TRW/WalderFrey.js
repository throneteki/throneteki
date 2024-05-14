const DrawCard = require('../../drawcard.js');

class WalderFrey extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: (card) =>
                card !== this && card.hasTrait('House Frey') && card.getType() === 'character',
            effect: ability.effects.consideredToBeAttacking()
        });
    }
}

WalderFrey.code = '06077';

module.exports = WalderFrey;
