const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class MarchedToTheWall extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.state = {};
    }
    revealed(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        var firstPlayer = this.game.getFirstPlayer();

        if(!firstPlayer) {
            return true;
        }

        var otherPlayer = this.game.getOtherPlayer(firstPlayer);

        this.state[firstPlayer.id].selecting = true;
        this.state[firstPlayer.id].selectedCard = undefined;
        this.state[firstPlayer.id].doneSelecting = false;

        this.setupSelection(firstPlayer);

        if(otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for opponent to select character';
            otherPlayer.buttons = [];

            this.state[otherPlayer.id].selecting = false;
            this.state[otherPlayer.id].selectedCard = undefined;
            this.state[otherPlayer.id].doneSelecting = false;
        }

        return false;
    }

    setupSelection(player) {
        player.menuTitle = 'Select a character to discard';
        player.buttons = [{ command: 'plot', method: 'cancelSelection', text: 'Done' }];

        this.game.promptForSelect(player, this.onCardSelected.bind(this));
    }

    cancelSelection(player) {
        if(!this.inPlay || !this.state[player.id].selecting) {
            return;
        }

        this.proceedToNextStep();
    }

    onCardSelected(player, cardId) {
        if(!this.inPlay || this.currentPlayer !== player) {
            return;
        }

        var card = player.findCardInPlayByUuid(cardId);

        if(!card || card.getType() !== 'character' || player.selectedCard) {
            return;
        }

        this.state[player.id].selecting = false;
        this.state[player.id].doneSelecting = true;
        this.state[player.id].selectedCard = card;

        this.proceedToNextStep();
    }

    doDiscard() {
        var sortedPlayers = this.game.getPlayersInFirstPlayerOrder();

        _.each(sortedPlayers, player => {
            player.discardCard(this.state[player.id].selectedCard.id, player.discardPile);
        });

        this.game.playerRevealDone(this.owner);
    }

    proceedToNextStep() {
        var stillToSelect = _.find(this.game.getPlayers(), player => {
            return !this.state[player.id].doneSelecting;
        });
        
        if(!stillToSelect) {
            this.doDiscard();

            return;
        }

        this.setupSelection(stillToSelect);
    }
}

MarchedToTheWall.code = '01015';

module.exports = MarchedToTheWall;
