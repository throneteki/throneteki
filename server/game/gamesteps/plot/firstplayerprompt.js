const _ = require('underscore');

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
        var players = [this.player].concat(_.reject(this.game.getPlayers(), p => p === this.player));

        return {
            menuTitle: 'Select first player',
            buttons: _.map(players, player => {
                return { text: player.name, command: 'menuButton', arg: player.id };
            })
        };
    }

    onMenuCommand(player, playerId) {
        if(player !== this.player) {
            return false;
        }

        var firstPlayer = this.game.getPlayerById(playerId);
        if(!firstPlayer) {
            return;
        }

        _.each(this.game.getPlayers(), player => {
            player.firstPlayer = firstPlayer === player;
        });

        this.game.addMessage('{0} has selected {1} to be the first player', player, firstPlayer);

        this.complete();
    }
}

module.exports = FirstPlayerPrompt;
