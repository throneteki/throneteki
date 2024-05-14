const DrawCard = require('../../drawcard.js');

class TheWinterMaid extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPlotsRevealed: () => true
            },
            max: ability.limit.perPhase(1),
            handler: (context) => {
                let buttons = context.event.plots.map((plot) => {
                    return { method: 'plotSelected', card: plot, mapCard: true };
                });

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select plot',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    plotSelected(player, card) {
        if (this.controller !== player) {
            return false;
        }

        this.untilEndOfRound((ability) => ({
            match: card,
            effect: ability.effects.addTrait('Winter')
        }));
        this.game.addMessage('{0} uses {1} to give the Winter trait to {2}', player, this, card);

        if (!this.game.anyPlotHasTraitDuringPlotInterrupt('Summer')) {
            this.game.addMessage(
                '{0} uses {1} to return {1} to their hand instead of their discard pile',
                player,
                this
            );
            player.moveCard(this, 'hand');
        }

        return true;
    }
}

TheWinterMaid.code = '19012';

module.exports = TheWinterMaid;
