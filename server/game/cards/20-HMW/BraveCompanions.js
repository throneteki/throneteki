const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');

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
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select cards',
                    numCards: 10,
                    numToSelect: 3,
                    cardCondition: (card, context) => card.getType() === 'character' && this.remainingTraits(context.selectedCards).some(trait => card.hasTrait(trait)),
                    onSelect: (player, cards) => this.selectCards(player, cards),
                    onCancel: player => this.cancelSearch(player),
                    source: this
                });
            }
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

    selectCards(player, cards) {
        for(let card of cards) {
            player.moveCard(card, 'hand');
        }
        this.game.addMessage('{0} uses {1} to search their deck and adds {2} to their hand', player, this, cards);
        return true;
    }

    cancelSearch(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not add any cards to their hand', player, this);
        return true;
    }
}

BraveCompanions.code = '20042';

module.exports = BraveCompanions;
