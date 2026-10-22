import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LordsportFisherman extends DrawCard {
    // Lordsport Fisherman (04051)
    // Reaction: After you marshal Lordsport Fisherman, add the bottom card of your deck to your
    // hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source &&
                    event.playingType === 'marshal' &&
                    context.player.drawDeck.length > 0
            },
            message: '{player} uses {source} to draw the bottom card of their deck',
            gameAction: GameActions.addToHand((context) => ({
                card: context.player.drawDeck.slice(-1)[0]
            }))
        });
    }
}

LordsportFisherman.code = '04051';

export default LordsportFisherman;
