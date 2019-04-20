const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class FleaBottomAlley extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            phase: 'marshal',
            target: {
                cardCondition: (card, context) => (
                    card.location === 'hand' &&
                    card.controller === context.player &&
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3 &&
                    context.player.canPutIntoPlay(card)
                )
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            handler: context => {
                context.player.putIntoPlay(context.target);
                let cards = context.player.drawCardsToHand(1).length;
                this.game.addMessage('{0} kneels and sacrifice {1} to put {2} into play from their hand and to draw {3} to hand',
                    context.player, this, context.target, TextHelper.count(cards, 'card'));
            }
        });
    }
}

FleaBottomAlley.code = '13006';

module.exports = FleaBottomAlley;
