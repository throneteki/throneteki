const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');

class Ashemark extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => this.hasToken(Tokens.gold)
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            handler: context => {
                for(let player of this.game.getPlayers()) {
                    let characters = player.filterCardsInPlay(card => card.getType() === 'character' && card.hasPrintedCost() && card.getPrintedCost() <= context.cardStateWhenInitiated.tokens.gold);
                    for(let card of characters) {
                        card.owner.returnCardToHand(card);
                    }
                }

                this.game.addMessage('{0} kneels and sacrifices {1} to return each character with printed cost {2} or less to its owner\'s hand',
                    context.player, this, context.cardStateWhenInitiated.tokens.gold);
            }
        });
    }
}

Ashemark.code = '08011';

module.exports = Ashemark;
