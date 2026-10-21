import DrawCard from '../../drawcard.js';

class WalderFrey extends DrawCard {
    // Walder Frey (06077)
    // Renown.
    // While Walder Frey is attacking, each other House Frey character you control is also
    // considered to be attacking.
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

export default WalderFrey;
