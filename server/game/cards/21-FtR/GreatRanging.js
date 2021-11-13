const DrawCard = require('../../drawcard.js');

class GreatRanging extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });
        
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.name === 'Fist of the First Men' && context.player.canPutIntoPlay(card),
                    additionalLocations: ['hand', 'discard pile'],
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play', player, this, card);
        player.putIntoPlay(card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not put any card into play', player, this);
    }
}

GreatRanging.code = '21013';

module.exports = GreatRanging;
