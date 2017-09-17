const _ = require('underscore');

const BaseStep = require('../basestep.js');

class KeepOrMulliganPrompt extends BaseStep {
    constructor(game) {
        super(game);
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
    }

    continue() {
        this.remainingPlayers = _.reject(this.remainingPlayers, player => player.readyToStart);

        if(_.isEmpty(this.remainingPlayers)) {
            return true;
        }

        this.promptPlayerToKeepOrMulligan(this.remainingPlayers[0]);

        return false;
    }

    promptPlayerToKeepOrMulligan(currentPlayer) {
        let buttons = [
            { method: 'keepOrMulligan', arg: 'keep', text: 'Keep Hand' },
            { method: 'keepOrMulligan', arg: 'mulligan', text: 'Mulligan' }
        ];

        this.game.promptWithMenu(currentPlayer, this, {
            activePrompt: {
                menuTitle: 'Keep Starting Hand?',
                buttons: buttons
            },
            waitingPromptTitle: `Waiting for ${currentPlayer.name} to keep hand or mulligan`
        });
    }

    keepOrMulligan(player, arg) {
        if(arg === 'keep') {
            player.keep();
            this.game.addMessage('{0} keeps their hand', player);
        } else if(arg === 'mulligan' && player.mulligan()) {
            this.game.addMessage('{0} takes a mulligan', player);
        }

        this.game.raiseEvent('onPlayerKeepHandOrMulligan', { player: player, choice: arg });

        return true;
    }
}

module.exports = KeepOrMulliganPrompt;
