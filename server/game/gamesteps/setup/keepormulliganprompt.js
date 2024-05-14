const AllPlayerPrompt = require('../allplayerprompt.js');

const { StartingHandSize } = require('../../Constants');

class KeepOrMulliganPrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);

        this.completedPlayers = new Set();
    }

    completionCondition(player) {
        return this.completedPlayers.has(player);
    }

    activePrompt() {
        return {
            menuTitle: 'Keep Starting Hand?',
            buttons: [
                { arg: 'keep', text: 'Keep Hand' },
                { arg: 'mulligan', text: 'Mulligan' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to keep hand or mulligan' };
    }

    onMenuCommand(player, arg) {
        if (this.completedPlayers.has(player)) {
            return;
        }

        this.completedPlayers.add(player);

        if (arg === 'keep') {
            this.game.addMessage('{0} has kept their hand', player);
        } else if (arg === 'mulligan') {
            this.mulligan(player);
            this.game.addMessage('{0} has taken a mulligan', player);
        }
        this.game.raiseEvent('onPlayerKeepHandOrMulligan', { player: player, choice: arg });
    }

    mulligan(player) {
        player.resetDrawDeck();
        player.shuffleDrawDeck();
        player.drawCardsToHand(StartingHandSize);
    }
}

module.exports = KeepOrMulliganPrompt;
