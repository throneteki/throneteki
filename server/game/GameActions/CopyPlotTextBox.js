import GameAction from './GameAction.js';

class CopyPlotTextBox extends GameAction {
    constructor() {
        super('copyPlotTextBox');
    }

    canChangeGameState({ source, target }) {
        return source !== target && typeof source.copyTextBoxFrom === 'function';
    }

    createEvent({ source, target, context }) {
        return this.event('onPlotTextBoxCopied', { source, target }, () => {
            source.copyTextBoxFrom(target);
        });
    }
}

export default new CopyPlotTextBox();
