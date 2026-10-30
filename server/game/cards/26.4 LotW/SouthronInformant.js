import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SouthronInformant extends DrawCard {
    // Southron Informant (26067)
    // Ambush (1).
    // Forced Reaction: After Southron Informant enters play during the challenges phase, give
    // control of it to an opponent. Then, discard 1 card at random from that player's hand and draw
    // 1 card.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && context.game.currentPhase === 'challenge'
            },
            chooseOpponent: true,
            message: '{player} is forced by {source} to give control of {source} to {opponent}',
            gameAction: GameActions.takeControl((context) => ({
                card: context.source,
                player: context.opponent
            })).then({
                message: {
                    format: "Then, {player} discards 1 card at random from {opponent}'s hand and draws 1 card",
                    args: { opponent: (context) => context.opponent }
                },
                gameAction: GameActions.simultaneously((context) => [
                    GameActions.discardAtRandom({
                        player: context.parentContext.opponent,
                        amount: 1
                    }),
                    GameActions.drawCards({ player: context.player, amount: 1 })
                ])
            })
        });
    }
}

SouthronInformant.code = '26067';

export default SouthronInformant;
