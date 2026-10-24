import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheSkahazadhan extends DrawCard {
    // The Skahazadhan (08054)
    // Reaction: After you reveal a plot card, kneel The Skahazadhan and discard 1 card from your
    // hand to gain 2 gold. (3 gold instead if that plot card has the Summer trait.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotsRevealed: (event, context) =>
                    event.plots.some((plot) => plot.controller === context.source.controller) &&
                    context.source.controller.canGainGold()
            },
            cost: [ability.costs.discardFromHand(), ability.costs.kneelSelf()],
            message: {
                format: '{player} kneels {source} and discards {costs.discardFromHand} to gain {amount} gold',
                args: {
                    amount: (context) => (context.player.activePlot.hasTrait('Summer') ? 3 : 2)
                }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: context.player.activePlot.hasTrait('Summer') ? 3 : 2
            }))
        });
    }
}

TheSkahazadhan.code = '08054';

export default TheSkahazadhan;
