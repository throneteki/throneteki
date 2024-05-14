import DrawCard from '../../drawcard.js';

class TheSkahazadhan extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotsRevealed: (event) =>
                    event.plots.some((plot) => plot.controller === this.controller) &&
                    this.controller.canGainGold()
            },
            cost: [ability.costs.discardFromHand(), ability.costs.kneelSelf()],
            handler: (context) => {
                let gold = context.player.activePlot.hasTrait('Summer') ? 3 : 2;
                gold = this.game.addGold(context.player, gold);

                this.game.addMessage(
                    '{0} kneels {1} and discards {2} to gain {3} gold',
                    context.player,
                    this,
                    context.costs.discardFromHand,
                    gold
                );
            }
        });
    }
}

TheSkahazadhan.code = '08054';

export default TheSkahazadhan;
