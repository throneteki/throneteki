import DrawCard from '../../drawcard.js';

class BaelorBlacktyde extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.cannotPlay((card) => this.hasCopyInDiscard(card))
        });
    }

    hasCopyInDiscard(card) {
        let discardPile = card.controller.discardPile;
        return discardPile.some(
            (discardedCard) => card !== discardedCard && card.isCopyOf(discardedCard)
        );
    }
}

BaelorBlacktyde.code = '13011';

export default BaelorBlacktyde;
