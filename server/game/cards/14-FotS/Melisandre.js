import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Melisandre extends DrawCard {
    // Melisandre (14003)
    // Stealth.
    // Reaction: After you win an [intrigue] challenge in which Melisandre is attacking, move 1
    // power from a character controlled by the losing opponent to Melisandre. Then, if that
    // character has no power, kill it.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isAttacking(context.source) &&
                    event.challenge.isMatch({ winner: context.player, challengeType: 'intrigue' })
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.power > 0 &&
                    card.controller === context.event.challenge.loser,
                gameAction: 'movePower'
            },
            message: '{player} uses {source} to move 1 power from {target} to {source}',
            gameAction: GameActions.movePower((context) => ({
                from: context.target,
                to: context.source,
                amount: 1
            })).then({
                gameAction: GameActions.ifCondition({
                    condition: (context) => context.parentContext.target.power === 0,
                    thenAction: {
                        message: {
                            format: 'Then {player} uses {source} to kill {character}',
                            args: { character: (context) => context.parentContext.target }
                        },
                        gameAction: GameActions.kill((context) => ({
                            card: context.parentContext.target
                        }))
                    }
                })
            })
        });
    }
}

Melisandre.code = '14003';

export default Melisandre;
