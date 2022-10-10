const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');
const Array = require('../../../Array');

class FreshRecruits extends DrawCard {
    setupCardAbilities() {
        const selectableTraits = ['Ranger', 'Builder', 'Steward'];
        this.action({
            title: 'Search deck',
            message: '{player} plays {source} to search their deck for a Ranger character, a Builder character and a Steward character',
            gameAction: GameActions.search({
                title: 'Select cards',
                numToSelect: 3,
                match: {
                    type: 'character',
                    // Checking if the card is already selected || if it has one of the selectable traits && that trait is remaining for selection
                    condition: (card, context) => context.selectedCards.includes(card) 
                    || selectableTraits.some(trait => card.hasTrait(trait)) 
                    && Array.availableToPair(selectableTraits, context.selectedCards, (trait, card) => card.hasTrait(trait)).some(trait => card.hasTrait(trait))
                },
                message: '{player} adds {searchTarget} to their hand',
                gameAction: GameActions.simultaneously(context => context.searchTarget.map(card => GameActions.addToHand({ card })))
            })
        });
    }
}

FreshRecruits.code = '11007';

module.exports = FreshRecruits;
