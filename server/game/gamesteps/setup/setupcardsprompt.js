const _ = require('underscore');

const BaseStep = require('../basestep.js');

class SetupCardsPrompt extends BaseStep {
    constructor(game) {
        super(game);
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
    }

    continue() {
        this.remainingPlayers = _.reject(this.remainingPlayers, player => player.setup);

        if(_.isEmpty(this.remainingPlayers)) {
            return true;
        }

        this.promptPlayerToSetup(this.remainingPlayers[0]);

        return false;
    }

    promptPlayerToSetup(currentPlayer) {
        let buttons = [
            { method: 'setupDone', text: 'Done' }
        ];

        this.game.promptWithMenu(currentPlayer, this, {
            activePrompt: {
                menuTitle: 'Select setup cards',
                buttons: buttons
            },
            waitingPromptTitle: `Waiting for ${currentPlayer.name} to finish setup`
        });
    }

    setupDone(player) {
        player.setup = true;
        this.game.addMessage('{0} finishes setup', player);

        return true;
    }
}

module.exports = SetupCardsPrompt;
