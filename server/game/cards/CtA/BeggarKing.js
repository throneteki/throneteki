const DrawCard = require('../../drawcard.js');

class BeggarKing extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });
        this.reaction({
            when: {
                onPlotsRevealed: event => {
                    let opponent = this.game.getOtherPlayer(this.controller);

                    if(!opponent || !event.plots.includes(opponent.activePlot)) {
                        return false;
                    }

                    return this.controller.activePlot.getIncome(true) < opponent.activePlot.getIncome(true);
                }
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let gold = 1;

                let opponent = this.game.getOtherPlayer(this.controller);
                if(!opponent || !opponent.anyCardsInPlay(card => card.hasTrait('King'))) {
                    gold = 2;
                }

                this.game.addGold(this.controller, gold);
                this.game.addMessage('{0} kneels {1} to gain {2} gold', this.controller, this, gold);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('targaryen')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

BeggarKing.code = '04034';

module.exports = BeggarKing;
