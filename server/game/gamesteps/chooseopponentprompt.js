const _ = require('underscore');
const BaseStep = require('./basestep.js');

/**
 * Prompt that asks the current player to select an opponent.
 */
class ChooseOpponentPrompt extends BaseStep {
    constructor(game, player, properties) {
        super(game);
        this.player = player;
        this.condition = properties.condition || (() => true);
        this.onSelect = properties.onSelect;
        this.onCancel = properties.onCancel || (() => true);
        this.source = properties.source;
    }

    continue() {
        let otherPlayers = _.filter(this.game.getPlayers(), player => player !== this.player && this.condition(player));

        if(otherPlayers.length === 0) {
            this.onCancel();
            return;
        }

        if(otherPlayers.length === 1) {
            this.onSelect(otherPlayers[0]);
            return;
        }

        let buttons = _.map(otherPlayers, player => {
            return { text: player.name, arg: player.name, method: 'selectPlayer' };
        });
        buttons.push({ text: 'Cancel', method: 'cancel' });
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

    cancel() {
        this.onCancel();
        return true;
    }
}

module.exports = ChooseOpponentPrompt;
