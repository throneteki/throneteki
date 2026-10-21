import DrawCard from '../../drawcard.js';

class KayceMerchant extends DrawCard {
    // Kayce Merchant (06089)
    // Bestow (3).
    // Reaction: After you collect income, discard 1 gold from Kayce Merchant to gain 2 gold.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onIncomeCollected: (event) =>
                    event.player === this.controller && this.controller.canGainGold()
            },
            cost: ability.costs.discardGold(),
            handler: () => {
                let gold = this.game.addGold(this.controller, 2);
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to gain {2} gold',
                    this.controller,
                    this,
                    gold
                );
            }
        });
    }
}

KayceMerchant.code = '06089';

export default KayceMerchant;
