import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OldtownCityWatch extends DrawCard {
    // Oldtown City Watch (24023)
    // Reaction: After Oldtown City Watch enters play, reveal the top card of each player's deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            message: '{player} uses {source} to reveal the top card of each players deck',
            gameAction: GameActions.revealCards((context) => ({
                cards: context.game.getPlayers().map((player) => player.drawDeck[0])
            }))
        });
    }
}

OldtownCityWatch.code = '24023';

export default OldtownCityWatch;
