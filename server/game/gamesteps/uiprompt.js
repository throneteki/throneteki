const BaseStep = require('./basestep.js');

class UiPrompt extends BaseStep {
    constructor(game) {
        super(game);
        this.completed = false;
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

    /**
     * Handler that will be called once isComplete() returns true.
     */
    onCompleted() {
    }
}

module.exports = UiPrompt;
