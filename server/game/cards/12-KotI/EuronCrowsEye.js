const DrawCard = require('../../drawcard.js');

class EuronCrowsEye extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.name === 'Silence' && context.player.canPutIntoPlay(card),
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

EuronCrowsEye.code = '12002';

module.exports = EuronCrowsEye;
