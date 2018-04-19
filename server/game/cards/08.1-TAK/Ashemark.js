const DrawCard = require('../../drawcard.js');

class Ashemark extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => this.hasToken('gold')
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            handler: context => {
                for(const player of this.game.getPlayers()) {
                    let characters = player.filterCardsInPlay(card => card.getType() === 'character' && card.getPrintedCost() <= context.cardStateWhenInitiated.tokens.gold);
                    for(const card of characters) {
                        card.owner.returnCardToHand(card);
                    }
                }

                this.game.addMessage('{0} kneels and sacrifices {1} to return each character with printed cost {2} or less to its owner\'s hand',
                    this.controller, this, context.cardStateWhenInitiated.tokens.gold);
            }
        });
    }
}

Ashemark.code = '08011';

module.exports = Ashemark;
