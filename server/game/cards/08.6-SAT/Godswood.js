import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class Godswood extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.attackingPlayer === this.controller &&
                    this.moreWinterThanSummerPlotsRevealed() &&
                    this.controller.canDraw()
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let cards = this.controller.activePlot.getClaim();
                cards = this.controller.drawCardsToHand(cards).length;

                this.game.addMessage(
                    '{0} kneels {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
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

export default Godswood;
