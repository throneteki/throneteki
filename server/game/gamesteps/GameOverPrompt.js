import AllPlayerPrompt from './allplayerprompt.js';
import RematchPrompt from './RematchPrompt.js';

class GameOverPrompt extends AllPlayerPrompt {
    constructor(game, winner) {
        super(game);
        this.winner = winner;
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
            promptTitle: this.winner ? 'Game Won' : 'Game Over',
            menuTitle: this.winner
                ? this.winner.name + ' has won the game!'
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

        this.clickedButton[player.name] = true;

        if (arg === 'rematch') {
            this.game.queueStep(new RematchPrompt(this.game, player));

            return true;
        }

        return true;
    }

    getPromptablePlayers() {
        return this.game.getAllPlayers().filter((player) => !player.left);
    }
}

export default GameOverPrompt;
