import BaseStep from './basestep.js';

/**
 * Prompt that asks the current player to select a player.
 */
class ChoosePlayerPrompt extends BaseStep {
    constructor(game, player, properties) {
        super(game);
        this.player = player;
        this.condition = properties.condition || (() => true);
        this.enabled = properties.enabled || (() => true);
        this.onSelect = properties.onSelect;
        this.onCancel = properties.onCancel || (() => true);
        this.source = properties.source;
        this.activePromptTitle = properties.activePromptTitle;
        this.waitingPromptTitle = properties.waitingPromptTitle;
    }

    continue() {
        let players = this.game.getPlayers().filter((player) => this.condition(player));

        if (players.length === 0) {
            this.onCancel();
            return;
        }

        if (players.length === 1) {
            this.onSelect(players[0]);
            return;
        }

        let buttons = players.map((player) => {
            return {
                text: player.name,
                arg: player.name,
                method: 'selectPlayer',
                disabled: () => !this.enabled(player)
            };
        });
        buttons.push({ text: 'Cancel', method: 'cancel' });
        this.game.promptWithMenu(this.player, this, {
            activePrompt: {
                menuTitle: this.activePromptTitle,
                buttons: buttons
            },
            waitingPromptTitle: this.waitingPromptTitle,
            source: this.source
        });
    }

    selectPlayer(player, selectedPlayerName) {
        let selectedPlayer = this.game.getPlayerByName(selectedPlayerName);

        if (!selectedPlayer) {
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

export default ChoosePlayerPrompt;
