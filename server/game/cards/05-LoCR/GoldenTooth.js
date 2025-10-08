import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GoldenTooth extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            condition: () => this.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to gain {amount} gold',
                args: { amount: () => this.getAmount() }
            },
            gameAction: GameActions.gainGold(() => ({ amount: this.getAmount() }))
        });
    }

    getAmount() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => opponent.getHandCount() === 0) ? 3 : 1;
    }
}

GoldenTooth.code = '05017';

export default GoldenTooth;
