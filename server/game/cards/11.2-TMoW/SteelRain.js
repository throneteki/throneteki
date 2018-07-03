const DrawCard = require('../../drawcard.js');

class SteelRain extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck for GJ locations',
            cost: ability.costs.sacrificeAny(card => card.isFaction('greyjoy') && card.getType() === 'location', false),
            handler: context => {
                for(let costCard of context.costs.sacrifice) {
                    this.game.promptForDeckSearch(context.player, {
                        activePromptTitle: 'Select a location with printed cost ' + costCard.getPrintedCost() + ' or less',
                        cardCondition: card => card.isFaction('greyjoy') && card.getType() === 'location' &&
                                               card.getPrintedCost() <= costCard.getPrintedCost() &&
                                               context.player.canPutIntoPlay(card),
                        onSelect: (player, card) => this.cardSelected(player, card),
                        onCancel: player => this.doneSelecting(player),
                        source: this
                    });
                }
                this.game.queueSimpleStep(() => {
                    for(let card of this.fetchedCards) {
                        context.player.putIntoPlay(card);
                    }

                    if(this.fetchedCards.length === 0) {
                        this.game.addMessage('{0} plays {1} and sacrifices {2} to search their deck but does not put any card in play',
                            context.player, this, context.costs.sacrifice);
                    } else {
                        this.game.addMessage('{0} plays {1} and sacrifices {2} to search their deck and put {3} into play',
                            context.player, this, context.costs.sacrifice, this.fetchedCards);
                    }

                    this.fetchedCards = [];
                });
            }
        });
    }

    cardSelected(player, card) {
        this.fetchedCards = this.fetchedCards || [];
        this.fetchedCards.push(card);
        return true;
    }

    doneSelecting() {
        this.fetchedCards = this.fetchedCards || [];
        return true;
    }
}

SteelRain.code = '11032';

module.exports = SteelRain;
