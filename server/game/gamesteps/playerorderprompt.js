import UiPrompt from './uiprompt.js';

/**
 * Represents a UI Prompt that prompts each player individually in first-player
 * order. Inheritors should call completePlayer() when the prompt for the
 * current player has been completed. Overriding skipCondition will exclude
 * any matching players from the prompt.
 */
class PlayerOrderPrompt extends UiPrompt {
    get currentPlayer() {
        this.lazyFetchPlayers();
        return this.players[0];
    }

    lazyFetchPlayers() {
        if (!this.players) {
            this.players = this.game.getPlayersInFirstPlayerOrder();
        }
    }

    skipPlayers() {
        this.lazyFetchPlayers();
        this.players = this.players.filter((p) => !this.skipCondition(p));
    }

    skipCondition() {
        return false;
    }

    completePlayer() {
        this.lazyFetchPlayers();
        this.players.shift();
    }

    setPlayers(players) {
        this.players = players;
    }

    isComplete() {
        this.lazyFetchPlayers();
        return this.players.length === 0;
    }

    activeCondition(player) {
        return player === this.currentPlayer;
    }

    checkPlayer() {
        if (this.currentPlayer && !this.currentPlayer.isPlaying()) {
            this.completePlayer();
        }
    }

    continue() {
        this.skipPlayers();
        return super.continue();
    }
}

export default PlayerOrderPrompt;
