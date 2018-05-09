const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class TyrionsChain extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => (
                    event.challenge.winner === this.controller &&
                    this.hasParticipatingUniqueLannister() &&
                    this.game.anyPlotHasTrait('War')
                )
            },
            max: ability.limit.perPhase(1),
            handler: context => {
                let warPlots = this.getRevealedWarPlots();

                let buttons = _.map(warPlots, card => ({
                    method: 'selectWarPlot', card: card
                }));

                this.context = context;

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a plot',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    hasParticipatingUniqueLannister() {
        return this.controller.anyCardsInPlay(card => this.game.currentChallenge.isParticipating(card) && card.isUnique() && card.isFaction('lannister') && card.getType() === 'character');
    }

    getRevealedWarPlots() {
        let revealedPlots = [];
        _.each(this.game.getPlayers(), player => {
            if(player.activePlot && player.activePlot.hasTrait('War')) {
                revealedPlots = revealedPlots.concat(player.activePlot);
            }
        });
        return revealedPlots;
    }

    selectWarPlot(player, cardId) {
        let warPlot = this.game.findAnyCardInAnyList(cardId);
        this.resolving = true;

        this.game.addMessage('{0} uses {1} to initiate the When Revealed ability of {2}', this.controller, this, warPlot);
        warPlot.controller = this.controller;

        let whenRevealed = warPlot.getWhenRevealedAbility();
        if(whenRevealed) {
            // Attach the current When Revealed event to the new context
            let context = whenRevealed.createContext(this.context.event);
            this.game.resolveAbility(whenRevealed, context);
        }
        this.game.queueSimpleStep(() => {
            warPlot.controller = warPlot.owner;
            this.resolving = false;
        });
        return true;
    }
}

TyrionsChain.code = '04110';

module.exports = TyrionsChain;
