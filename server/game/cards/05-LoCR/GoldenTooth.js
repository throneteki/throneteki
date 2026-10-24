import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GoldenTooth extends DrawCard {
    // Golden Tooth (05017)
    // Limited.
    // Action: Kneel Golden Tooth to gain 1 gold. (3 gold instead if an opponent has no cards in his
    // or her hand.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            condition: (context) => context.source.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to gain {amount} gold',
                args: { amount: (context) => context.source.getAmount() }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: context.source.getAmount()
            }))
        });
    }

    getAmount() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => opponent.getHandCount() === 0) ? 3 : 1;
    }
}

GoldenTooth.code = '05017';

export default GoldenTooth;
