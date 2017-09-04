const AllPlayerPrompt = require('../allplayerprompt.js');

class SelectPlotPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return !!player.selectedPlot;
    }

    activePrompt() {
        return {
            menuTitle: 'Select a plot',
            buttons: [
                { arg: 'plotselected', text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent to select plot',
            buttons: [
                { arg: 'changeplot', text: 'Change Plot' }
            ] };
    }

    onMenuCommand(player) {
        var plot = player.findCard(player.plotDeck, card => {
            return card.selected;
        });

        if(!plot) {
            return;
        }

        let newPlot = !!player.selectedPlot;

        player.selectedPlot = plot;

        if(newPlot) {
            this.game.addMessage('{0} has changed their plot selection', player);
        } else {
            this.game.addMessage('{0} has selected a plot', player);
        }
    }
}

module.exports = SelectPlotPrompt;
