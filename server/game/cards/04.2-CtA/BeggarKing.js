import DrawCard from '../../drawcard.js';

class BeggarKing extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen' });
        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });
        this.reaction({
            when: {
                onPlotsRevealed: (event) =>
                    this.opponentRevealedLowerIncome(event.plots) && this.controller.canGainGold()
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let gold = !this.opponentHasKing() ? 2 : 1;
                gold = this.game.addGold(this.controller, gold);

                this.game.addMessage(
                    '{0} kneels {1} to gain {2} gold',
                    this.controller,
                    this,
                    gold
                );
            }
        });
    }

    opponentRevealedLowerIncome(plots) {
        let opponentPlots = plots.filter((plot) => plot.controller !== this.controller);

        return opponentPlots.some(
            (opponentPlot) =>
                this.controller.activePlot.getPrintedIncome() < opponentPlot.getPrintedIncome()
        );
    }

    opponentHasKing() {
        return this.game.anyCardsInPlay(
            (card) =>
                card.controller !== this.controller &&
                card.getType() === 'character' &&
                card.hasTrait('King')
        );
    }
}

BeggarKing.code = '04034';

export default BeggarKing;
