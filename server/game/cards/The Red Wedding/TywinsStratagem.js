const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class TywinsStratagem extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return characters to hand',
            phase: 'challenge',
            targets: {
                ownToReturn: {
                    activePromptTitle: 'Select a character',
                    cardCondition: card => card.controller === this.controller && this.cardCondition(card)
                },
                opponentToReturn: {
                    activePromptTitle: 'Select a character',
                    cardCondition: card => card.controller !== this.controller && this.cardCondition(card)
                }
            },
            handler: context => {
                let characters = [context.targets.ownToReturn, context.targets.opponentToReturn];

                _.each(characters, card => {
                    card.owner.returnCardToHand(card);
                });

                this.game.addMessage('{0} plays {1} to return {2} to {3}\'s hand and {4} to {5}\'s hand',
                    this.controller, this, characters[0], characters[0].owner, characters[1], characters[1].owner);
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

    cardCondition(card) {
        return card.location === 'play area' && card.getType() === 'character' && card.getCost() <= 2;
    }
}

TywinsStratagem.code = '06070';

module.exports = TywinsStratagem;
