const DrawCard = require('../../../drawcard.js');

class ChamberOfThePaintedTable extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDominanceDetermined']);
    }

    onDominanceDetermined(winner) {
        if(!this.inPlay || this.isBlank() || this.owner !== winner) {
            return;
        }

        this.game.promptWithMenu(winner, this, {
            activePrompt: {
                menuTitle: 'Kneel ' + this.name + '?',
                buttons: [
                    { text: 'Yes', command: 'menuButton', method: 'gainPower' },
                    { text: 'No', command: 'menuButton', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to perform reactions'
        });
    }

    gainPower(player) {
        if(!this.inPlay || this.isBlank() || this.owner !== player) {
            return false;
        }

        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer || otherPlayer.power === 0) {
            return;
        }

        this.game.addMessage('{0} uses {1} to move 1 power from {2}\'s faction card to their own', player, this, otherPlayer);
        this.game.transferPower(player, otherPlayer, 1);

        return true;
    }

    cancel(player) {
        if(!this.inPlay || this.isBlank() || this.owner !== player) {
            return false;
        }

        this.game.addMessage('{0} declines to trigger {1}', player, this);
        return true;
    }
}

ChamberOfThePaintedTable.code = '01060';

module.exports = ChamberOfThePaintedTable;
