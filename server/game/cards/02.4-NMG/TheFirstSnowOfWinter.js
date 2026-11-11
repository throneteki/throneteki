import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class TheFirstSnowOfWinter extends PlotCard {
    // The First Snow of Winter (02079)
    // Forced Reaction: After the challenges phase begins, return each character with printed cost 3
    // or lower to its owner's hand.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            message:
                '{player} uses {source} to force each player to return each card with printed cost 3 or lower to their hand',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .filterCardsInPlay((card) =>
                        card.isMatch({ type: 'character', printedCostOrLower: 3 })
                    )
                    .map((card) => GameActions.returnCardToHand({ card }))
            )
        });
    }
}

TheFirstSnowOfWinter.code = '02079';

export default TheFirstSnowOfWinter;
