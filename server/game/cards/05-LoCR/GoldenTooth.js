import DrawCard from '../../drawcard.js';

class GoldenTooth extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            condition: () => this.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let gold = this.opponentHasEmptyHand() ? 3 : 1;
                gold = this.game.addGold(this.controller, gold);

                this.game.addMessage(
                    '{0} kneels {1} to gain {2} gold',
                    this.controller,
                    this,
                    gold
                );
            }
        });
    }

    opponentHasEmptyHand() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => opponent.hand.length === 0);
    }
}

GoldenTooth.code = '05017';

export default GoldenTooth;
