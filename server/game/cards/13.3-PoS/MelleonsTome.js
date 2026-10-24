import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MalleonsTome extends DrawCard {
    // Malleon's Tome (13042)
    // Shadow (1).
    // Attached character gains an [intrigue] icon.
    // Reaction: After you win a challenge in which attached character is attacking, look at the
    // losing opponent's hand. If attached character is Eddard Stark or has the Maester trait, stand
    // it. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addIcon('intrigue')
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.attackingPlayer === context.player &&
                    event.challenge.winner === context.player &&
                    !!context.source.parent &&
                    event.challenge.isAttacking(context.source.parent)
            },
            message: {
                format: "{player} plays {source} to look at {loser}'s hand",
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.simultaneously([
                GameActions.lookAtHand((context) => ({
                    player: context.player,
                    opponent: context.event.challenge.loser,
                    context
                })),
                GameActions.ifCondition({
                    condition: (context) =>
                        context.source.parent.name === 'Eddard Stark' ||
                        context.source.parent.hasTrait('Maester'),
                    thenAction: {
                        message: {
                            format: '{player} uses {source} to stand {parent}',
                            args: { parent: (context) => context.source.parent }
                        },
                        gameAction: GameActions.standCard((context) => ({
                            card: context.source.parent
                        }))
                    }
                })
            ]),
            limit: ability.limit.perPhase(1)
        });
    }
}

MalleonsTome.code = '13042';

export default MalleonsTome;
