import AllPlayerPrompt from '../gamesteps/allplayerprompt.js';

class WaitForPlayerPrompt extends AllPlayerPrompt {
    constructor(game, targetPlayer, waitFunc = () => true) {
        super(game);

        this.targetPlayer = targetPlayer;
        this.waitFunc = waitFunc;
        this.clickedButton = {};
    }

    completionCondition(player) {
        return this.cancelled || this.clickedButton[player.name];
    }

    activePrompt() {
        return {
            menuTitle: `Wait for ${this.targetPlayer.name}?`,
            buttons: [
                { arg: 'yes', text: 'Yes' },
                { arg: 'no', text: 'No (Eliminate)' }
            ]
        };
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent(s) to agree to wait'
        };
    }

    onMenuCommand(player, arg) {
        this.clickedButton[player.name] = arg;
        if (arg === 'yes') {
            this.game.addMessage('{0} would like to wait for {1}', player, this.targetPlayer);
        } else {
            this.game.addMessage('{0} would like to eliminate {1}', player, this.targetPlayer);
        }

        return true;
    }

    getPromptablePlayers() {
        return this.game.getPlayers().filter((player) => !this.game.isDisconnected(player));
    }

    onCompleted() {
        if (Object.values(this.clickedButton).some((arg) => arg === 'yes')) {
            this.waitFunc();
        } else {
            this.game.gameOverHandler.playerDisconnected(this.targetPlayer);
        }
    }
}

export default WaitForPlayerPrompt;
