const DrawCard = require('../../../drawcard.js');

class Loot extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: ({challenge}) => this.controller === challenge.winner && challenge.isUnopposed() &&
                                                 this.opponentDeckSize() >= 1
            },
            cost: ability.costs.payXGold(() => this.opponentDeckSize(), this.game.getOtherPlayer(this.controller)),
            handler: context => {
                let opponent = this.game.getOtherPlayer(this.controller);
                opponent.discardFromDraw(context.goldCostAmount);
                this.game.addMessage('{0} plays {1} and pays {2} gold from {3}\'s gold pool to discard the top {2} cards from {3}\'s deck',
                    this.controller, this, context.goldCostAmount, opponent);
            }
        });
    }

    opponentDeckSize() {
        let opponent = this.game.getOtherPlayer(this.controller);

        if(!opponent) {
            return false;
        }

        return opponent.drawDeck.size();
    }
}

Loot.code = '02073';

module.exports = Loot;
