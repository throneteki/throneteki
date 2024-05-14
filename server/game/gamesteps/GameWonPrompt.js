import AllPlayerPrompt from './allplayerprompt.js';
import RematchPrompt from './RematchPrompt.js';

class GameWonPrompt extends AllPlayerPrompt {
    constructor(game, winner) {
        super(game);
        this.winner = winner;
        this.clickedButton = {};
    }

    completionCondition(player) {
        return !!this.clickedButton[player.name] || this.game.disableWonPrompt;
    }

    activePrompt() {
        var buttons = [
            { arg: 'continue', text: 'Continue Playing' },
            { arg: 'rematch', text: 'Rematch' }
        ];

        if (this.game.isPlaytesting() && this.game.instance.reviewFormId) {
            buttons.unshift({
                arg: `googleForm:${this.game.instance.reviewFormId}`,
                text: 'Submit card review (external page)'
            });
        }

        return {
            promptTitle: 'Game Won',
            menuTitle:
                this.winner === null
                    ? 'Game ends in a draw'
                    : this.winner.name + ' has won the game!',
            buttons
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose to continue' };
    }

    onMenuCommand(player, arg) {
        let message = arg === 'continue' ? 'to continue' : 'a rematch';
        this.game.addMessage('{0} would like {1}', player, message);

        this.clickedButton[player.name] = true;

        if (arg === 'rematch') {
            this.game.queueStep(new RematchPrompt(this.game, player));

            return true;
        }

        return true;
    }
}

export default GameWonPrompt;
