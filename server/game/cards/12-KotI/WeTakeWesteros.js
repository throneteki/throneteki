import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class WeTakeWesteros extends PlotCard {
    // We Take Westeros! (12046)
    // When Revealed: Choose a location in a discard pile and put it into play under your control.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.getType() === 'location' &&
                    card.location === 'discard pile' &&
                    context.player.canPutIntoPlay(card)
            },
            message: {
                format: "{player} uses {source} to put {target} into play from {owner}'s discard pile ",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

WeTakeWesteros.code = '12046';

export default WeTakeWesteros;
