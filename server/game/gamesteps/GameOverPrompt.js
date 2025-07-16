import TextHelper from '../TextHelper.js';
import AllPlayerPrompt from './allplayerprompt.js';
import RematchPrompt from './RematchPrompt.js';

class GameOverPrompt extends AllPlayerPrompt {
    constructor(game, winners) {
        super(game);
        this.winners = winners;
        this.clickedButton = {};
    }

    completionCondition(player) {
        return !!this.clickedButton[player.name];
    }

    activePrompt() {
        const buttons = [
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
            promptTitle: this.winners ? 'Game Won' : 'Game Over',
            menuTitle: this.winners
                ? TextHelper.formatList(
                      this.winners.map((w) => w.name),
                      'and'
                  ) + ' has won the game!'
                : 'Game has ended without a winner',
            buttons
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose to continue' };
    }

    onMenuCommand(player, arg) {
        let message = arg === 'continue' ? 'to continue' : 'a rematch';
        this.game.addMessage('{0} would like {1}', player, message);

        this.clickedButton[player.name] = arg;

        if (arg === 'rematch') {
            this.game.queueStep(new RematchPrompt(this.game, player));

            return true;
        }

        return true;
    }

    onCompleted() {
        const responses = Object.values(this.clickedButton);
        if (responses.every((r) => r === 'continue')) {
            this.game.isPostGameOver = true;
        }
    }

    getPromptablePlayers() {
        return this.game.getAllPlayers().filter((player) => !player.left);
    }
}

export default GameOverPrompt;
