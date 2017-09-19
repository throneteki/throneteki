const UIPrompt = require('../uiprompt.js');

class PlotRevealPrompt extends UIPrompt {
    constructor(game, player) {
        super(game);

        this.player = player;
    }

    activeCondition(player) {
        return player === this.player;
    }

    activePrompt() {
        let players = this.game.getPlayersInBoardOrder(player => player === this.player);
        let buttons = players.map(player => {
            return { text: player.name, arg: player.name };
        });

        return {
            menuTitle: 'Select first player',
            buttons: buttons
        };
    }

    onMenuCommand(player, playerName) {
        if(player !== this.player) {
            return false;
        }

        let firstPlayer = this.game.getPlayerByName(playerName);
        if(!firstPlayer) {
            return;
        }

        for(let player of this.game.getPlayers()) {
            player.firstPlayer = (firstPlayer === player);
        }

        this.game.addMessage('{0} has selected {1} to be the first player', player, firstPlayer);
    }

    continue() {
        this.setPrompt();

        return false;
    }
}

module.exports = PlotRevealPrompt;
