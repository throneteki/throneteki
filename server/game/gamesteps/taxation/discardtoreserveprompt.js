const PlayerOrderPrompt = require('../playerorderprompt.js');

class DiscardToReservePrompt extends PlayerOrderPrompt {
    activePrompt() {
        return {
            menuTitle: 'Discard down to ' + this.currentPlayer.reserve + ' cards',
            buttons: [
                { command: 'menuButton', text: 'Done' }
            ]
        }
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to discard down to reserve' };
    }

    onMenuCommand(player, arg) {
        if(player !== this.currentPlayer) {
            return false;
        }

        if(player.isBelowReserve()) {
            this.completePlayer();
        }
    }

    skipCondition(player) {
        return player.isBelowReserve();
    }
}

module.exports = DiscardToReservePrompt;
