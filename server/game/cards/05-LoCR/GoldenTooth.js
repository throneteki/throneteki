const DrawCard = require('../../drawcard.js');

class GoldenTooth extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let gold = this.opponentHasEmptyHand() ? 3 : 1;
                this.game.addMessage('{0} kneels {1} to gain {2} gold', this.controller, this, gold);
                this.game.addGold(this.controller, gold);
            }
        });
    }

    opponentHasEmptyHand() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some(opponent => opponent.hand.size() === 0);
    }
}

GoldenTooth.code = '05017';

module.exports = GoldenTooth;
