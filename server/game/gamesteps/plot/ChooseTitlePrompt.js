import BaseStep from '../basestep.js';

class ChooseTitlePrompt extends BaseStep {
    constructor(game, titlePool) {
        super(game);

        this.titlePool = titlePool;
        this.remainingPlayers = game.getPlayersInFirstPlayerOrder();
        this.selections = [];
    }

    continue() {
        if (!this.game.isMelee) {
            return true;
        }

        if (this.selections.length === 0) {
            this.remainingTitles = this.titlePool.getCardsForSelection();
        }

        if (this.remainingPlayers.length !== 0) {
            let currentPlayer = this.remainingPlayers.shift();
            this.promptForTitle(currentPlayer);
            return false;
        }

        this.titlePool.announceTitles(this.selections);
    }

    promptForTitle(player) {
        let buttons = this.remainingTitles.map((title) => {
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
