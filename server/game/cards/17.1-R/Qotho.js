import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Qotho extends DrawCard {
    // Qotho (17131)
    // Action: If there is a Summer plot card revealed, discard 2 [targaryen] cards from your hand
    // to put Qotho into play from your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put Qotho into play',
            location: 'hand',
            condition: (context) =>
                context.player.canPutIntoPlay(context.source) &&
                context.game.anyPlotHasTrait('Summer'),
            cost: ability.costs.discardMultipleFromHand(
                2,
                (card, context) => card !== context.source && card.isFaction('targaryen')
            ),
            message: '{player} discards {costs.discardFromHand} to put {source} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
    }
}

Qotho.code = '17131';

export default Qotho;
