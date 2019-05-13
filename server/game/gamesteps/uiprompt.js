const BaseStep = require('./basestep.js');
const uuid = require('uuid');

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
    }

    setPrompt() {
        for(let player of this.game.getPlayers()) {
            if(this.activeCondition(player)) {
                player.setPrompt(this.addDefaultCommandToButtons(this.activePrompt(player)));
            } else {
                player.setPrompt(this.addDefaultCommandToButtons(this.waitingPrompt(player)));
            }
        }
    }

    activeCondition() {
        return true;
    }

    activePrompt() {
    }

    addDefaultCommandToButtons(original) {
        var prompt = Object.assign({}, original);
        if(prompt.buttons) {
            for(let button of prompt.buttons) {
                button.command = button.command || 'menuButton';
                button.promptId = this.promptId;
            }
        }

        if(prompt.controls) {
            for(let control of prompt.controls) {
                control.promptId = this.promptId;
            }
        }

        return prompt;
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent' };
    }

    continue() {
        var completed = this.isComplete();

        if(completed) {
            this.clearPrompts();
            this.onCompleted();
        } else {
            this.setPrompt();
        }

        return completed;
    }

    clearPrompts() {
        for(let player of this.game.getPlayers()) {
            player.cancelPrompt();
        }
    }

    isCorrectPrompt(promptId) {
        if(!promptId) {
            return false;
        }

        return promptId.toLowerCase() === this.promptId.toLowerCase();
    }

    /**
     * Handler that will be called once isComplete() returns true.
     */
    onCompleted() {
    }
}

module.exports = UiPrompt;
