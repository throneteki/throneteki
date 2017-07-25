const _ = require('underscore');
const BaseStep = require('./basestep.js');

/**
 * Prompt that asks the current player to select an opponent.
 */
class SelectOpponentPrompt extends BaseStep {
    constructor(game, player, properties) {
        super(game);
        this.player = player;
        this.condition = properties.condition || (() => true);
        this.onSelect = properties.onSelect;
        this.source = properties.source;
    }

    continue() {
        let otherPlayers = _.filter(this.game.getPlayers(), player => player !== this.player && this.condition(player));

        if(otherPlayers.length === 0) {
            return;
        }

        if(otherPlayers.length === 1) {
            this.onSelect(otherPlayers[0]);
            return;
        }

        let buttons = _.map(otherPlayers, player => {
            return { text: player.name, arg: player.name, method: 'selectPlayer' };
        });
        this.game.promptWithMenu(this.player, this, {
            activePrompt: {
                menuTitle: 'Select an opponent',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for player to select an opponent',
            source: this.source
        });
    }

    selectPlayer(player, selectedPlayerName) {
        let selectedPlayer = this.game.getPlayerByName(selectedPlayerName);

        if(!selectedPlayer) {
            return false;
        }

        this.onSelect(selectedPlayer);
        return true;
    }
}

module.exports = SelectOpponentPrompt;
