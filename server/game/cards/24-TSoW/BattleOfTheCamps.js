import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class BattleOfTheCamps extends PlotCard {
    // Battle of the Camps (24030)
    // Reaction: After you win a [military] challenge as the attacking player, choose and kneel a
    // character controlled by the losing opponent. (You may kill that character instead if it has
    // the Army trait.) (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        challengeType: 'military',
                        attackingPlayer: context.source.controller,
                        winner: context.source.controller
                    })
            },
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    condition: (card, context) => card.controller === context.event.challenge.loser
                }
            },
            message: {
                format: '{player} uses {source} to {actions} {target}',
                args: {
                    actions: (context) =>
                        !context.target.hasTrait('Army') ? 'kneel' : 'either kneel or kill'
                }
            },
            limit: ability.limit.perPhase(1),
            gameAction: GameActions.ifCondition({
                condition: (context) => !context.target.hasTrait('Army'),
                thenAction: {
                    gameAction: GameActions.kneelCard((context) => ({
                        card: context.target
                    }))
                },
                elseAction: GameActions.choose({
                    title: (context) => `Kill ${context.target.name} instead?`,
                    choices: {
                        Kill: {
                            message: '{player} chooses to kill {target}',
                            gameAction: GameActions.kill((context) => ({
                                card: context.target
                            }))
                        },
                        Kneel: {
                            message: '{player} chooses to kneel {target}',
                            gameAction: GameActions.kneelCard((context) => ({
                                card: context.target
                            }))
                        }
                    }
                })
            })
        });
    }
}

BattleOfTheCamps.code = '24030';

export default BattleOfTheCamps;
