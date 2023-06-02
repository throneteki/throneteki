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
            buttons: this.getFirstPlayerChoices().map((player) => {
                return { text: player.name, arg: player.name };
            })
        };
    }

    getFirstPlayerChoices() {
        let opponents = this.game.getPlayers().filter((player) => player !== this.player);
        let firstPlayerChoices = [this.player].concat(opponents);
        let validChoices = firstPlayerChoices.filter(
            (player) => !player.hasFlag('cannotBeFirstPlayer')
        );

        if (validChoices.length === 0) {
            validChoices = firstPlayerChoices;
        }

        let selectableChoices = validChoices.filter((player) =>
            this.player.canSelectAsFirstPlayer(player)
        );

        if (selectableChoices.length === 0) {
            selectableChoices = validChoices;
        }

        return selectableChoices;
    }

    onMenuCommand(player, playerName) {
        if (player !== this.player) {
            return false;
        }

        var firstPlayer = this.game.getPlayerByName(playerName);
        if (!firstPlayer) {
            return;
        }

        this.game.setFirstPlayer(firstPlayer);
        this.game.addMessage('{0} has selected {1} to be the first player', player, firstPlayer);
        this.game.activePlayer = firstPlayer;

        this.complete();
    }

    getPlayer() {
        return this.player;
    }
}

module.exports = FirstPlayerPrompt;
