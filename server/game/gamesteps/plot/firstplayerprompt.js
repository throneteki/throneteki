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
        var otherPlayer = this.game.getOtherPlayer(this.player);

        return {
            menuTitle: 'Select first player',
            buttons: [
                { text: this.player.name, command: 'menuButton', arg: this.player.id },
                { text: otherPlayer.name, command: 'menuButton', arg: otherPlayer.id }
            ]
        };
    }

    onMenuCommand(player, firstPlayer) {
        if(player !== this.player) {
            return false;
        }

        console.log(firstPlayer);
    }

    continue() {
        this.setPrompt();

        return false;
    }
}

module.exports = FirstPlayerPrompt;
