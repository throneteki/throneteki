const PlotCard = require('../../plotcard');
const TextHelper = require('../../TextHelper');

class ReturnToTheFields extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                type: 'select',
                mode: 'upTo',
                numCards: 3,
                cardCondition: card => card.getType() === 'character' && card.location === 'play area' && card.controller === this.controller,
                gameAction: 'sacrifice'
            },
            handler: (context) => {
                for(let target of context.target) {
                    context.player.sacrificeCard(target);
                }

                let cardsDrawn = context.player.drawCardsToHand(context.target.length).length;
                let goldGained = this.game.addGold(context.player, context.target.length);
                this.game.addMessage('{0} uses {1} to sacrifice {2}, draw {3}, and gain {4} gold', context.player, this, context.target, TextHelper.count(cardsDrawn, 'card'), goldGained);
            }
        });
    }
}

ReturnToTheFields.code = '12047';

module.exports = ReturnToTheFields;
