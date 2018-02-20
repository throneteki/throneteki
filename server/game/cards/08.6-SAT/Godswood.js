const DrawCard = require('../../drawcard.js');

class Godswood extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event =>
                    event.challenge.winner === this.controller && this.moreWinterThanSummerPlotsRevealed()
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let numCards = this.controller.activePlot.getClaim();
                this.controller.drawCardsToHand(numCards);
                this.game.addMessage('{0} kneels {1} to draw {2} cards', this.controller, this, numCards);
            }
        });
    }

    moreWinterThanSummerPlotsRevealed() {
        let winterPlots = this.game.getNumberOfPlotsWithTrait('Winter');
        let summerPlots = this.game.getNumberOfPlotsWithTrait('Summer');

        return winterPlots > summerPlots;
    }
}

Godswood.code = '08102';

module.exports = Godswood;
