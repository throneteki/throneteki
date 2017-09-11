const _ = require('underscore');

const BaseStep = require('../basestep.js');

class ChooseTitlePrompt extends BaseStep {
    constructor(game, titlePool) {
        super(game);

        this.titlePool = titlePool;
        this.remainingPlayers = game.getPlayersInFirstPlayerOrder();
        this.selections = [];
    }

    continue() {
        if(!this.game.isMelee) {
            return true;
        }

        if(this.selections.length === 0) {
            this.remainingTitles = this.titlePool.getCardsForSelection();
        }

        if(this.remainingPlayers.length !== 0) {
            let currentPlayer = this.remainingPlayers.shift();
            this.promptForTitle(currentPlayer);
            return false;
        }

        _.each(this.selections, selection => {
            this.titlePool.chooseFromPool(selection.player, selection.title);
            this.game.addMessage('{0} selects {1}', selection.player, selection.title);
        });
    }

    promptForTitle(player) {
        let buttons = _.map(this.remainingTitles, title => {
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
        let title = this.remainingTitles.find(title => title.uuid === titleId);

        if(!title) {
            return false;
        }

        this.remainingTitles = _.reject(this.remainingTitles, t => t === title);
        this.selections.push({ player: player, title: title });

        return true;
    }
}

module.exports = ChooseTitlePrompt;
