import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KayceMerchant extends DrawCard {
    // Kayce Merchant (06089)
    // Bestow (3).
    // Reaction: After you collect income, discard 1 gold from Kayce Merchant to gain 2 gold.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onIncomeCollected: (event, context) =>
                    event.player === context.source.controller &&
                    context.source.controller.canGainGold()
            },
            cost: ability.costs.discardGold(),
            message: '{player} discards 1 gold from {source} to gain 2 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

KayceMerchant.code = '06089';

export default KayceMerchant;
