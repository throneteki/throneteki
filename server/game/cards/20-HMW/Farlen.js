const DrawCard = require('../../drawcard.js');

class Farlen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.hasTrait('Direwolf') && card.isUnique(),
            effect: ability.effects.addKeyword('Renown')
        });
   
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.name === 'The Wolfswood' && context.player.canPutIntoPlay(card),
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

Farlen.code = '20026';

module.exports = Farlen;
