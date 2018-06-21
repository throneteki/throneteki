const BaseStep = require('./basestep.js');

/**
 * Prompt that asks the current player to select an opponent.
 */
class ChooseOpponentPrompt extends BaseStep {
    constructor(game, player, properties) {
        super(game);
        this.player = player;
        this.condition = properties.condition || (() => true);
        this.enabled = properties.enabled || (() => true);
        this.onSelect = properties.onSelect;
        this.onCancel = properties.onCancel || (() => true);
        this.source = properties.source;
    }

    continue() {
        let otherPlayers = this.game.getPlayers().filter(player => player !== this.player && this.condition(player));

        if(otherPlayers.length === 0) {
            this.onCancel();
            return;
        }

        if(otherPlayers.length === 1) {
            this.onSelect(otherPlayers[0]);
            return;
        }

        let buttons = otherPlayers.map(player => {
            return { text: player.name, arg: player.name, method: 'selectPlayer', disabled: () => !this.enabled(player) };
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
