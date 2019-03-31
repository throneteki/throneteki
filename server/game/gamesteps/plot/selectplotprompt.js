const AllPlayerPrompt = require('../allplayerprompt.js');

class SelectPlotPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        let selectableCards = player.getRevealablePlots();
        if(selectableCards.length === 1) {
            player.selectedPlot = selectableCards[0];
        }

        return !!player.selectedPlot;
    }

    activePrompt() {
        return {
            menuTitle: 'Select a plot',
            buttons: [
                { arg: 'plotselected', text: 'Done' }
            ],
            selectCard: true
        };
    }

    waitingPrompt(player) {
        if(!player.canChoosePlot()) {
            return {
                menuTitle: 'Waiting for opponent to select plot'
            };
        }

        return {
            menuTitle: 'Waiting for opponent to select plot',
            buttons: [
                { arg: 'changeplot', text: 'Change Plot' }
            ]
        };
    }

    onMenuCommand(player, arg) {
        if(arg === 'changeplot') {
            player.selectedPlot = undefined;
            this.game.addMessage('{0} has cancelled their plot selection', player);

            return;
        }

        let plot = player.plotDeck.find(card => card.selected);

        if(!plot) {
            return;
        }

        player.selectedPlot = plot;
        player.clearSelectableCards();

        this.game.addMessage('{0} has selected a plot', player);
    }

    highlightSelectableCards(player) {
        player.selectCard = true;
        player.setSelectableCards(player.getRevealablePlots());
    }

    continue() {
        for(let player of this.game.getPlayers()) {
            if(!this.completionCondition(player)) {
                this.highlightSelectableCards(player);
            }
        }

        return super.continue();
    }
}

module.exports = SelectPlotPrompt;
