const DrawCard = require('../../../drawcard.js');

class FreyBastard extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && this.getNumberOfAttackingFreys() >= 2
            },
            cost: ability.costs.discardGold(),
            handler: () => {
                this.game.addPower(this.controller, 1);
                this.game.addMessage('{0} discards a gold from {1} to gain 1 power for their faction', 
                                      this.controller, this);
            }
        });
    }

    getNumberOfAttackingFreys() {
        let cards = this.controller.filterCardsInPlay(card => {
            return this.game.currentChallenge.isAttacking(card) && card.hasTrait('House Frey') && card.getType() === 'character';
        });

        return cards.length;
    }
}

FreyBastard.code = '06078';

module.exports = FreyBastard;
