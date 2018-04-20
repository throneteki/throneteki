const UIPrompt = require('../uiprompt.js');

class FirstPlayerPrompt extends UIPrompt {
    constructor(game, player) {
        super(game);

        this.player = player;
    }

    activeCondition(player) {
        return player === this.player;
    }

    activePrompt() {
        return {
            menuTitle: 'Select first player',
            buttons: this.getFirstPlayerChoices().map(player => {
                return { text: player.name, arg: player.name };
            })
        };
    }

    getFirstPlayerChoices() {
        let opponents = this.game.getPlayers().filter(player => player !== this.player);
        let firstPlayerChoices = [this.player].concat(opponents);
        return firstPlayerChoices.filter(player => this.player.canSelectAsFirstPlayer(player));
    }

    onMenuCommand(player, playerName) {
        if(player !== this.player) {
            return false;
        }

        var firstPlayer = this.game.getPlayerByName(playerName);
        if(!firstPlayer) {
            return;
        }

        for(const player of this.game.getPlayers()) {
            player.firstPlayer = firstPlayer === player;
        }

        this.game.addMessage('{0} has selected {1} to be the first player', player, firstPlayer);
        this.game.raiseEvent('onFirstPlayerDetermined', { player: firstPlayer });

        this.complete();
    }
}

module.exports = FirstPlayerPrompt;
