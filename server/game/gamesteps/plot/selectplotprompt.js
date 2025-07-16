import AllPlayerPrompt from '../allplayerprompt.js';

class SelectPlotPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        if (player.mustRevealPlot) {
            player.selectedPlot = player.mustRevealPlot;
            //explicitly call clearSelectableCards so the selectable cards
            //get reset for the next plot phase after cards are recycled
            player.clearSelectableCards();
        } else {
            let selectableCards = player.getSelectableCards();
            if (selectableCards.length === 1) {
                player.selectedPlot = selectableCards[0];
                //explicitly call clearSelectableCards so the selectable cards
                //get reset for the next plot phase after cards are recycled
                player.clearSelectableCards();
            }
        }

        return !!player.selectedPlot || player.hasFlag('cannotRevealPlot');
    }

    activePrompt(player) {
        if (player.confirmingPlot) {
            return {
                menuTitle:
                    'Show plot selection to ' +
                    player.mustShowPlotSelection.map((p) => p.name).join(', ') +
                    '?',
                buttons: [
                    { arg: 'plotconfirmed', text: 'Yes' },
                    { arg: 'plotcancelled', text: 'No' }
                ]
            };
        }
        return {
            menuTitle: 'Select a plot',
            buttons: [{ arg: 'plotselected', text: 'Done' }],
            selectCard: true
        };
    }

    waitingPrompt(player) {
        if (player.mustRevealPlot || player.hasFlag('cannotRevealPlot')) {
            return {
                menuTitle: 'Waiting for opponent(s) to select plot'
            };
        }

        return {
            menuTitle: 'Waiting for opponent(s) to select plot',
            buttons: [{ arg: 'changeplot', text: 'Change Plot' }]
        };
    }

    onMenuCommand(player, arg) {
        if (arg === 'changeplot') {
            this.unSelectPlot(player, false);
            return;
        }

        if (arg === 'plotconfirmed' && player.confirmingPlot) {
            this.selectPlot(player, player.confirmingPlot);
            delete player.confirmingPlot;
            return;
        }

        if (arg === 'plotcancelled' && player.confirmingPlot) {
            delete player.confirmingPlot;
            return;
        }
        let plot = player.plotDeck.find((card) => card.selected);

        if (!plot) {
            return;
        }

        if (player.mustShowPlotSelection.length > 0) {
            player.confirmingPlot = plot;
            return;
        }

        this.selectPlot(player, plot);
    }

    unSelectPlot(player, forced = false) {
        if (player.selectedPlot) {
            player.selectedPlot = undefined;
            if (forced) {
                this.game.addMessage('{0} has been forced to cancel their plot selection', player);
            } else {
                this.game.addMessage('{0} has cancelled their plot selection', player);
            }
            // Force all players who must see this plot selection to unselect their current selection to prevent plot reveals
            for (let p of player.mustShowPlotSelection) {
                this.unSelectPlot(p, true);
            }
        }
    }

    selectPlot(player, plot) {
        player.selectedPlot = plot;
        player.clearSelectableCards();

        this.game.addMessage('{0} has selected a plot', player);
    }

    highlightSelectableCards(player) {
        let selectableCards = this.game.allCards.filter(
            (card) =>
                card.getType() === 'plot' &&
                card.location === 'plot deck' &&
                card.controller === player &&
                !card.notConsideredToBeInPlotDeck
        );

        player.selectCard = true;
        player.setSelectableCards(selectableCards);
    }

    continue() {
        for (let player of this.getPromptablePlayers()) {
            if (!this.completionCondition(player)) {
                this.highlightSelectableCards(player);
            }
        }

        return super.continue();
    }
}

export default SelectPlotPrompt;
