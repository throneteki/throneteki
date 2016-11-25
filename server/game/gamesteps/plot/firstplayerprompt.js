const UIPrompt = require('../uiprompt.js');

class FirstPlayerPrompt extends UIPrompt {
    constructor(game, player) {
        super(game);

        this.player = player;
    }

    onMenuCommand(player, firstPlayer) {
        if(player !== this.player) {
            return false;
        }

        console.log(firstPlayer);
    }

    setPrompt() {
        this.originalPrompt = this.originalPrompt || this.player.currentPrompt();

        var otherPlayer = this.game.getOtherPlayer(this.player);

        this.player.setPrompt({
            selectCard: true,
            menuTitle: 'Select first player',
            buttons: [
                { text: this.player.name, command: 'menuButton', arg: 'me' },
                { text: otherPlayer.name, command: 'menuButton', arg: 'opponent'}
            ]
        });
    }

    continue() {
        this.setPrompt();
        return this.attached;
    }
}

module.exports = FirstPlayerPrompt;
