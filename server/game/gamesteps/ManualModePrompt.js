import AllPlayerPrompt from './allplayerprompt.js';

class ManualModePrompt extends AllPlayerPrompt {
    constructor(game, requestingPlayer, direction, onAgreed) {
        super(game);

        this.requestingPlayer = requestingPlayer;
        this.direction = direction;
        this.onAgreed = onAgreed;
        this.completedPlayers = new Set([requestingPlayer]);
        this.refused = false;
    }

    completionCondition(player) {
        return this.refused || this.completedPlayers.has(player);
    }

    activePrompt() {
        return {
            menuTitle: `${this.requestingPlayer.name} asks to turn manual mode ${this.direction}. Allow?`,
            buttons: [
                { arg: 'yes', text: 'Allow' },
                { arg: 'no', text: 'Refuse' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponents to answer the manual mode request' };
    }

    onMenuCommand(player, arg) {
        if (arg === 'yes') {
            this.game.addAlert('info', '{0} agrees', player);
            this.completedPlayers.add(player);
        } else {
            this.game.addAlert('info', '{0} refuses', player);
            this.refused = true;
        }

        return true;
    }

    getPromptablePlayers() {
        return this.game.getPlayers();
    }

    onCompleted() {
        if (!this.refused) {
            this.onAgreed();
        }
    }
}

export default ManualModePrompt;
