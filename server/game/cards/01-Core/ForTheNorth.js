import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ForTheNorth extends DrawCard {
    // For the North! (01157)
    // Play only during a [military] challenge.
    // Action: Choose a participating [stark] character. Until the end of the challenge, that
    // character gets +2 STR. If you win the challenge, draw 1 card.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give +2 STR to character',
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'military' }),
            target: {
                cardCondition: (card) => card.isParticipating() && card.isFaction('stark')
            },
            message:
                '{player} plays {source} to give +2 STR to {target} until the end of the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfChallenge',
                    match: context.target,
                    effect: ability.effects.modifyStrength(2)
                })),
                GameActions.delayedEffect({
                    duration: 'untilEndOfChallenge',
                    when: {
                        afterChallenge: (event, context) =>
                            event.challenge.winner === context.player
                    },
                    message: '{player} draws 1 card for {source}',
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                })
            ])
        });
    }
}

ForTheNorth.code = '01157';

export default ForTheNorth;
