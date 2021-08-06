const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');
const Array = require('../../../Array');

class FreshRecruits extends DrawCard {
    setupCardAbilities() {
        const selectableTraits = ['Ranger', 'Builder', 'Steward'];
        this.action({
            title: 'Search deck',
            gameAction: GameActions.search({
                title: 'Select cards',
                topCards: 10,
                numToSelect: 3,
                match: {
                    type: 'character',
                    // Checking if the card is already selected || if it has one of the selectable traits && that trait is remaining for selection
                    condition: (card, context) => context.selectedCards.includes(card) 
                    || selectableTraits.some(trait => card.hasTrait(trait)) 
                    && Array.availableToPair(selectableTraits, context.selectedCards, (trait, card) => card.hasTrait(trait)).some(trait => card.hasTrait(trait))
                },
                message: '{player} uses {source} to search their deck and add {searchTarget} to their hand',
                cancelMessage: '{player} uses {source} to search their deck but does not find a card',
                gameAction: GameActions.simultaneously(context => (
                    context.searchTarget.map(card => GameActions.addToHand({ card }))
                ))
            })
        });
    }
}

FreshRecruits.code = '11007';

module.exports = FreshRecruits;
