import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class ASouthronPeace extends PlotCard {
    // A Southron Peace (25039)
    // When Revealed: Choose an opponent. Until you reveal a new plot card, you and that player
    // cannot initiate [military] challenges against each other.
    setupCardAbilities(ability) {
        this.whenRevealed({
            chooseOpponent: true,
            message:
                '{player} uses {source} to prevent military challenges from being initiated between {opponent} and themselves until they reveal a new plot card',
            gameAction: GameActions.simultaneously(() => [
                GameActions.lastingEffect((context) => ({
                    duration: 'custom',
                    until: {
                        onCardEntersPlay: (event) =>
                            event.card.getType() === 'plot' &&
                            event.card.controller === context.player
                    },
                    targetController: context.opponent,
                    effect: ability.effects.cannotInitiateChallengeType(
                        'military',
                        (opponent) => opponent === context.player
                    )
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'custom',
                    until: {
                        onCardEntersPlay: (event) =>
                            event.card.getType() === 'plot' &&
                            event.card.controller === context.player
                    },
                    targetController: 'current',
                    effect: ability.effects.cannotInitiateChallengeType(
                        'military',
                        (opponent) => opponent === context.opponent
                    )
                }))
            ])
        });
    }
}

ASouthronPeace.code = '25039';

export default ASouthronPeace;
