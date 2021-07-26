const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');
const GameActions = require('../../GameActions');
const Array = require('../../../Array');

class BraveCompanions extends DrawCard {
    setupCardAbilities(ability) {
        const selectableTraits = ['Army', 'Commander', 'Mercenary'];
        this.persistentEffect({
            match: card => card === this,
            effect: ability.effects.dynamicStrength(() => this.calculateStrength())
        });
                      
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
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
    
    calculateStrength() {
        let cards = this.controller.filterCardsInPlay(card => {
            return card.getType() === 'character' && card.hasToken(Tokens.gold);
        });

        return cards.length;
    }
}

BraveCompanions.code = '20042';

module.exports = BraveCompanions;
