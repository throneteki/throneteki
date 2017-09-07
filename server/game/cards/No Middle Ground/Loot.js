const DrawCard = require('../../../drawcard.js');

class Loot extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => this.controller === event.challenge.winner && event.challenge.isUnopposed() &&
                                         this.getOpponentDeckSize() >= 1
            },
            cost: ability.costs.payXGold(() => 1, () => this.getOpponentDeckSize(), this.game.getOtherPlayer(this.controller)),
            handler: context => {
                let opponent = this.game.getOtherPlayer(this.controller);
                opponent.discardFromDraw(context.goldCostAmount);
                this.game.addMessage('{0} plays {1} and pays {2} gold from {3}\'s gold pool to discard the top {2} cards from {3}\'s deck',
                    this.controller, this, context.goldCostAmount, opponent);
            }
        });
    }

    getOpponentDeckSize() {
        let opponent = this.game.getOtherPlayer(this.controller);

        if(!opponent) {
            return false;
        }

        return opponent.drawDeck.size();
    }
}

Loot.code = '02073';

module.exports = Loot;
