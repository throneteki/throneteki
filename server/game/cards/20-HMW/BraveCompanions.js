const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');
const GameActions = require('../../GameActions');

class BraveCompanions extends DrawCard {
    setupCardAbilities(ability) {
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
                    condition: (card, context) => this.remainingTraits(context.selectedCards).some(trait => card.hasTrait(trait))
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

    remainingTraits(selectedCards) {
        const traits = ['Army', 'Commander', 'Mercenary'];
        return traits.filter(trait => !selectedCards.some(card => card.hasTrait(trait)));
    }
}

BraveCompanions.code = '20042';

module.exports = BraveCompanions;
