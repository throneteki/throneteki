const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class TywinsStratagem extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return characters to hand',
            phase: 'challenge',
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.getCost() <= 2,
                mode: 'eachPlayer',
                gameAction: 'returnToHand'
            },
            handler: context => {
                _.each(context.target, card => card.owner.returnCardToHand(card));
                this.game.addMessage('{0} plays {1} to return {2} to its owner\'s hands',
                    this.controller, this, context.target);
            }
        });

        this.reaction({
            location: 'discard pile',
            when: {
                onCardsDiscarded: event => this.controller !== event.player &&
                                           ['hand', 'draw deck'].includes(event.originalLocation) &&
                                           _.any(event.cards, card => card.getType() === 'character')
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            handler: () => {
                this.game.addMessage('{0} pays 1 gold to move {1} back to their hand', this.controller, this);
                this.controller.moveCard(this, 'hand');
            }
        });
    }
}

TywinsStratagem.code = '06070';

module.exports = TywinsStratagem;
