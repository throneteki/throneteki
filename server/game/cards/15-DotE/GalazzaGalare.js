const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class GalazzaGalare extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.playingType === 'marshal' && event.card === this
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.search({
                        title: 'Select up to 3 characters',
                        numToSelect: 3,
                        topCards: 10,
                        match: {
                            faction: 'targaryen', type: 'character',
                            condition: (card, context) => this.hasValidPrintedCost(card, context)
                        },
                        message: '{player} uses {source} to search their deck and add {searchTarget} to their hand',
                        cancelMessage: '{player} uses {source} to search their deck but does not find a card',
                        gameAction: GameActions.simultaneously(context => (
                            context.searchTarget.map(card => GameActions.addToHand({ card }))
                        ))
                    }),
                    context
                );
            }
        });
    }

    hasValidPrintedCost(card, context) {
        const {selectedCards} = context;
        const printedCost = card.getPrintedCost();

        if(selectedCards.length === 0) {
            return printedCost >= 6 || printedCost <= 2;
        }

        if(selectedCards.some(card => card.getPrintedCost() >= 6)) {
            // Only allow a single 6+ cost card
            return false;
        }

        return printedCost <= 2;
    }
}

GalazzaGalare.code = '15006';

module.exports = GalazzaGalare;
