import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class UndergroundVault extends DrawCard {
    // Underground Vault (06046)
    // Limited.
    // Marshaling Action: Kneel Underground Vault to gain 1 gold. (2 gold instead if the gold value
    // on an opponent's revealed plot card is 5 or higher.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to gain {amount} gold',
                args: { amount: (context) => goldAmount(context) }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: goldAmount(context)
            }))
        });
    }
}

function goldAmount(context) {
    return context.game
        .getOpponents(context.player)
        .some((opponent) => opponent.activePlot.getIncome() >= 5)
        ? 2
        : 1;
}

UndergroundVault.code = '06046';

export default UndergroundVault;
