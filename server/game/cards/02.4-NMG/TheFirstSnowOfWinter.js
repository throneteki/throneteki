const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');

class TheFirstSnowOfWinter extends PlotCard {
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

module.exports = TheFirstSnowOfWinter;
