class BaseStep {
    constructor(game) {
        this.game = game;
    }

    continue() {}

    onCardClicked() {
        return false;
    }

    onMenuCommand() {
        return false;
    }

    isCorrectPrompt() {
        return true;
    }

    getDebugInfo() {
        return this.constructor.name;
    }
}

module.exports = BaseStep;
