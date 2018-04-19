const _ = require('underscore');
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
        for(const player of this.game.getPlayers()) {
            if(this.activeCondition(player)) {
                player.setPrompt(this.addDefaultCommandToButtons(this.activePrompt()));
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
        var prompt = _.clone(original);
        if(prompt.buttons) {
            for(const button of prompt.buttons) {
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
        } else {
            this.setPrompt();
        }

        return completed;
    }

    clearPrompts() {
        for(const player of this.game.getPlayers()) {
            player.cancelPrompt();
        }
    }
}

module.exports = UiPrompt;
