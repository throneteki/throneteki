import DrawCard from '../../drawcard.js';

class TyrionsChain extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    this.hasParticipatingUniqueLannister(context.player) &&
                    this.game.anyPlotHasTrait('War')
            },
            max: ability.limit.perPhase(1),
            handler: (context) => {
                let warPlots = this.getRevealedWarPlots();

                let buttons = warPlots.map((card) => ({
                    method: 'selectWarPlot',
                    card: card,
                    mapCard: true
                }));

                this.context = context;

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select a plot',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    hasParticipatingUniqueLannister(player) {
        return player.anyCardsInPlay(
            (card) =>
                card.isParticipating() &&
                card.isUnique() &&
                card.isFaction('lannister') &&
                card.getType() === 'character'
        );
    }

    getRevealedWarPlots() {
        let revealedPlots = [];
        for (let player of this.game.getPlayers()) {
            if (player.activePlot && player.activePlot.hasTrait('War')) {
                revealedPlots = revealedPlots.concat(player.activePlot);
            }
        }
        return revealedPlots;
    }

    selectWarPlot(player, warPlot) {
        this.game.addMessage(
            '{0} uses {1} to initiate the When Revealed ability of {2}',
            this.context.player,
            this,
            warPlot
        );

        let whenRevealed = warPlot.getWhenRevealedAbility();
        if (whenRevealed) {
            // Attach the current When Revealed event to the new context
            let context = whenRevealed.createContext(this.context.event);
            context.player = this.context.player;
            this.game.resolveAbility(whenRevealed, context);
        }
        return true;
    }
}

TyrionsChain.code = '04110';

export default TyrionsChain;
