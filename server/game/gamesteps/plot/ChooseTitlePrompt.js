import BaseStep from '../basestep.js';

class ChooseTitlePrompt extends BaseStep {
    constructor(game, titlePool) {
        super(game);

        this.titlePool = titlePool;
        this.remainingPlayers = game.getPlayersInFirstPlayerOrder();
        this.remainingTitles = titlePool.getCardsForSelection();
        this.selections = [];
    }

    continue() {
        if (this.remainingPlayers.length !== 0) {
            const currentPlayer = this.remainingPlayers.shift();
            this.promptForTitle(currentPlayer);
            return false;
        }

        this.titlePool.announceTitles(this.selections);
    }

    promptForTitle(player) {
        const buttons = this.remainingTitles.map((title) => {
            return { method: 'chooseTitle', card: title };
        });
        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Select a title',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for ' + player.name + ' to select a title'
        });
    }

    chooseTitle(player, titleId) {
        const title = this.remainingTitles.find((title) => title.uuid === titleId);

        if (!title) {
            return false;
        }

        this.titlePool.chooseFromPool(player, title);
        this.remainingTitles = this.remainingTitles.filter((t) => t !== title);
        this.selections.push({ player: player, title: title });
        this.game.addMessage('{0} has selected their title', player);

        return true;
    }
}

export default ChooseTitlePrompt;
