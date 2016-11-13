const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class BuildingOrders extends PlotCard {
    revealed(player) {
        if(this.owner !== player) {
            return;
        }

        var attachmentsAndLocations = player.searchDrawDeck(10, card => {
            return card.getType() === 'attachment' || card.getType() === 'location';
        });

        var buttons = _.map(attachmentsAndLocations, card => {
            return { text: card.name, command: 'plot', method: 'cardSelected', arg: card.uuid };
        });

        buttons.push({ text: 'Done', command: 'plot', method: 'doneSelecting' });

        player.buttons = buttons;
        player.menuTitle = 'Select a card to add to your hand';
    }

    cardSelected(player, cardId) {
        if(this.owner !== player) {
            return;
        }

        var card = player.findCardInPlayByUuid(cardId);

        if(!card) {
            return;
        }

        player.moveFromDrawDeckToHand(card);
        player.shuffleDrawDeck();

        this.game.addMessage(player.name + ' uses ' + this.name + ' to reveal ' + card.name + ' and add it to their hand');

        this.game.playerRevealDone(player);
    }

    doneSelecting(player) {
        if(this.owner !== player) {
            return;
        }
        
        this.game.playerRevealDone(player);
    }
}

BuildingOrders.code = '01005';

module.exports = BuildingOrders;
