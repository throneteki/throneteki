import ActionWindow from '../actionwindow.js';

class MarshalingActionWindow extends ActionWindow {
    constructor(game, marshalingPlayer) {
        super(game, 'Marshaling', 'marshal');
        this.marshalingPlayer = marshalingPlayer;
    }

    continue() {
        const completed = super.continue();
        if (completed) {
            this.clearMarshalPermission();
        } else {
            this.syncMarshalPermission();
        }
        return completed;
    }

    skipCondition(player) {
        if (player === this.marshalingPlayer) {
            return false;
        }

        return !player.promptedActionWindows[this.windowName];
    }

    activePrompt(player) {
        if (player === this.marshalingPlayer) {
            return {
                menuTitle: 'Marshal your cards',
                buttons: [{ text: 'Done', endsTurn: true }],
                promptTitle: 'Your turn to marshal'
            };
        }

        return {
            ...super.activePrompt(),
            promptTitle: `${this.marshalingPlayer.name} is marshaling`
        };
    }

    markActionAsTaken(player) {
        super.markActionAsTaken(player);
        this.syncMarshalPermission();
    }

    syncMarshalPermission() {
        for (const player of this.game.getPlayers()) {
            player.allowMarshal = player === this.marshalingPlayer && player === this.currentPlayer;
        }
    }

    clearMarshalPermission() {
        for (const player of this.game.getPlayers()) {
            player.allowMarshal = false;
        }
    }
}

export default MarshalingActionWindow;
