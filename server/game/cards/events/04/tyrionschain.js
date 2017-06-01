const _ = require('underscore');
const DrawCard = require('../../../drawcard.js');

class TyrionsChain extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    this.hasParticipatingUniqueLannister() &&
                    this.game.anyPlotHasTrait('War')
                )
            },
            max: ability.limit.perPhase(1),
            handler: () => {
                let warPlots = this.getRevealedWarPlots();

                let buttons = _.map(warPlots, card => ({
                    method: 'selectWarPlot', card: card
                }));

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a War plot to resolve',
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
        var revealedPlots = [];
        _.each(this.game.getPlayers(), player => {
            if(player.activePlot && player.activePlot.hasTrait('War')) {
                revealedPlots = revealedPlots.concat(player.activePlot);
            }
        });
        return revealedPlots;
    }

    selectWarPlot(player, card) {
        var warPlot = this.controller.findCardByUuid(this.game.allCards, card);
        this.resolving = true;

        this.game.addMessage('{0} uses {1} to initiate the When Revealed ability of {2}', this.controller, this, warPlot);
        warPlot.controller = this.controller;
        this.game.raiseMergedEvent('onPlotsWhenRevealed', { plots: [warPlot] });
        this.game.queueSimpleStep(() => {
            warPlot.controller = warPlot.owner;
            this.resolving = false;
        });
        return true;
    }
}

TyrionsChain.code = '04110';

module.exports = TyrionsChain;
