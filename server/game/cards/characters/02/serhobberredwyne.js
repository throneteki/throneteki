const DrawCard = require('../../../drawcard.js');
const _ = require('underscore');

class SerHobberRedwyne extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, card) => card === this && this.game.currentPhase === 'marshal'
            },
            handler: () => {
                var characters = this.controller.searchDrawDeck(this.controller.drawDeck.length, card => {
                    return card.hasTrait('Lady');
                });
                var buttons = _.map(characters, card => {
                    return { text: card.name, method: 'cardSelected', arg: card.uuid, card: card.getSummary(true) };
                });
                buttons.push({ text: 'Done', method: 'doneSelecting' });
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a card to add to your hand',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    cardSelected(player, cardId) {
        var card = player.findCardByUuid(player.drawDeck, cardId);
        if(!card) {
            return false;
        }
        player.moveCard(card, 'hand');
        player.shuffleDrawDeck();
        this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, card);
        return true;
    }

    doneSelecting(player) {
        player.shuffleDrawDeck();
        this.game.addMessage('{0} does not use {1} to add a card to their hand', player, this);
        return true;
    }
}

SerHobberRedwyne.code = '02043';

module.exports = SerHobberRedwyne;
