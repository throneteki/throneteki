import BaseStep from './basestep.js';

class PlayActionPrompt extends BaseStep {
    constructor(game, player, playActions, context) {
        super(game);
        this.player = player;
        this.playActions = playActions;
        this.context = context;
    }

    continue() {
        var index = 0;
        var buttons = this.playActions.map((action) => {
            var button = { text: action.title || 'Play', method: 'selectAction', arg: index };
            index++;
            return button;
        });

        const menuTitle =
            this.playActions.length === 1
                ? `Play ${this.context.source.name}?`
                : 'Play ' + this.context.source.name + ':';

        this.game.promptWithMenu(this.player, this, {
            activePrompt: {
                menuTitle,
                buttons: [...buttons, { text: 'Cancel', method: 'cancel', cancel: true }]
            },
            source: this.context.source,
            hideSourceFromOpponents: true,
            beforeInitiation: true
        });
    }

    cancel() {
        return true;
    }

    selectAction(player, index) {
        var playAction = this.playActions[index];
        this.game.resolveAbility(playAction, this.context);
        return true;
    }
}

export default PlayActionPrompt;
