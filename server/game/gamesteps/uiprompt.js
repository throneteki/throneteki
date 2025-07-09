import BaseStep from './basestep.js';
import uuid from 'uuid';

class UiPrompt extends BaseStep {
    constructor(game) {
        super(game);
        this.completed = false;
        this.promptId = uuid.v1();
    }

    isComplete() {
        return this.completed;
    }

    complete() {
        this.completed = true;
        if (this.getPlayer()) {
            this.getPlayer().setIsActivePrompt(false);
        }
    }

    setPrompt() {
        for (let player of this.getPromptablePlayers()) {
            if (this.activeCondition(player)) {
                player.setPrompt(this.addDefaultCommandToButtons(this.activePrompt(player)));
                player.setIsActivePrompt(true);
            } else {
                player.setPrompt(this.addDefaultCommandToButtons(this.waitingPrompt(player)));
                player.setIsActivePrompt(false);
            }
        }
    }

    activeCondition() {
        return true;
    }

    activePrompt() {}

    addDefaultCommandToButtons(original) {
        var prompt = Object.assign({}, original);
        if (prompt.buttons) {
            for (let button of prompt.buttons) {
                button.command = button.command || 'menuButton';
                button.promptId = this.promptId;
            }
        }

        if (prompt.controls) {
            for (let control of prompt.controls) {
                control.promptId = this.promptId;
            }
        }

        return prompt;
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent' };
    }

    checkPlayer() {
        const player = this.getPlayer();
        if (!player?.isPlaying()) {
            this.complete();
            return false;
        }
        return true;
    }

    continue() {
        this.checkPlayer();

        const completed = this.isComplete();
        if (completed) {
            this.clearPrompts();
            this.onCompleted();
        } else {
            this.setPrompt();
        }

        return completed;
    }

    clearPrompts() {
        for (let player of this.getPromptablePlayers()) {
            player.cancelPrompt();
        }
    }

    isCorrectPrompt(promptId) {
        if (!promptId) {
            return false;
        }

        return promptId.toLowerCase() === this.promptId.toLowerCase();
    }

    /**
     * Handler that will be called once isComplete() returns true.
     */
    onCompleted() {}

    /**
     * Will be implemented in sub classes that have a specific player that is using the prompt
     */
    getPlayer() {
        return undefined;
    }
    /**
     * Explicitly gets which players can recieve this prompt, and can be overridden in sub classes
     */
    getPromptablePlayers() {
        return this.game.getPlayers();
    }
}

export default UiPrompt;
