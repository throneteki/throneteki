const AllPlayerPrompt = require('../allplayerprompt.js');

class SelectPlotPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        if(player.mustRevealPlot) {
            player.selectedPlot = player.mustRevealPlot;
            //explicitly call clearSelectableCards so the selectable cards
            //get reset for the next plot phase after cards are recycled
            player.clearSelectableCards();
        } else {
            let selectableCards = player.getSelectableCards();
            if(selectableCards.length === 1) {
                player.selectedPlot = selectableCards[0];
                //explicitly call clearSelectableCards so the selectable cards
                //get reset for the next plot phase after cards are recycled
                player.clearSelectableCards();
            }
        }

        return !!player.selectedPlot || player.hasFlag('cannotRevealPlot');
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
        if(player.mustRevealPlot || player.hasFlag('cannotRevealPlot')) {
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
        let selectableCards = this.game.allCards.filter(card => card.getType() === 'plot' &&
            card.location === 'plot deck' &&
            card.controller === player &&
            !card.notConsideredToBeInPlotDeck);

        player.selectCard = true;
        player.setSelectableCards(selectableCards);
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
