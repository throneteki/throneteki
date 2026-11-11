import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class WeaponsAtTheDoor extends PlotCard {
    // Weapons at the Door (03051)
    // Forced Reaction: After the challenges phase begins, return each card with the printed
    // attachment cardtype to its owner's hand.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            message:
                '{player} uses {source} to force each player to return each card with printed attachment cardtype to their hand',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .filterCardsInPlay(
                        (card) =>
                            card.getPrintedType() === 'attachment' && card.parent && !card.facedown
                    )
                    .map((card) => GameActions.returnCardToHand({ card }))
            )
        });
    }
}

WeaponsAtTheDoor.code = '03051';

export default WeaponsAtTheDoor;
