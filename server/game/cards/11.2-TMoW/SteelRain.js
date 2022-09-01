const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class SteelRain extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck for GJ locations',
            cost: ability.costs.sacrificeAny(card => card.isFaction('greyjoy') && card.getType() === 'location', false),
            message: {
                format: '{player} plays {source} to sacrifice {costs.sacrifice} and search their deck for {amount} Greyjoy locations',
                args: { amount: context => context.costs.sacrifice.length }
            },
            handler: context => {
                context.fetchedCards = [];
                for(let costCard of context.costs.sacrifice) {
                    this.game.resolveGameAction(GameActions.search({
                        title: `Select a location for ${costCard.name} (printed cost ${costCard.getPrintedCost()} or less)`,
                        match: {
                            faction: 'greyjoy',
                            type: 'location',
                            printedCostOrLower: costCard.getPrintedCost(),
                            condition: (card, context) => !context.fetchedCards.includes(card) && card.name !== costCard.name && context.player.canPutIntoPlay(card)
                        },
                        reveal: false,
                        gameAction: GameActions.genericHandler(context => {
                            context.fetchedCards.push(context.searchTarget);
                        })
                    }), 
                    context);
                }
                this.game.queueSimpleStep(() => {
                    if(context.fetchedCards.length === 0) {
                        this.game.addMessage('{0} does not put any cards into play', context.player);
                    } else {
                        this.game.addMessage('{0} puts {1} into play', context.player, context.fetchedCards);
                    }

                    this.game.resolveGameAction(GameActions.simultaneously(context => 
                        context.fetchedCards.map(card => GameActions.putIntoPlay({ card }))    
                    ), context);

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
