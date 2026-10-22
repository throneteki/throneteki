import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Qotho extends DrawCard {
    // Qotho (09037)
    // Action: Discard 2 [targaryen] cards from your hand to put Qotho into play from your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put Qotho into play',
            location: 'hand',
            condition: (context) => context.player.canPutIntoPlay(context.source),
            cost: ability.costs.discardMultipleFromHand(
                2,
                (card) => card !== this && card.isFaction('targaryen')
            ),
            message: '{player} discards {costs.discardFromHand} to put {source} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
    }
}

Qotho.code = '09037';

export default Qotho;
