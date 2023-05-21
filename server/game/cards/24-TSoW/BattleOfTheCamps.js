const GameActions = require('../../GameActions');
const PlotCard = require('../../plotcard');

class BattleOfTheCamps extends PlotCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ challengeType: 'military', attackingPlayer: this.controller, winner: this.controller })
            },
            target: {
                cardCondition: { type: 'character', location: 'play area', conditon: (card, context) => card.controller === context.event.challenge.loser }
            },
            message: {
                format: '{player} uses {source} to {actions} {target}',
                args: { actions: context => !context.target.hasTrait('Army') ? 'kneel' : 'kneel or kill' }
            },
            limit: ability.limit.perPhase(1),
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.ifCondition({
                        condition: context => !context.target.hasTrait('Army'),
                        thenAction: {
                            gameAction: GameActions.kneelCard(context => ({ card: context.target }))
                        },
                        elseAction: GameActions.choose({
                            title: context => `Kill ${context.target.name} instead?`,
                            choices: {
                                'Kill': {
                                    message: '{player} chooses to kill {target}',
                                    gameAction: GameActions.kill(context => ({ card: context.target }))
                                },
                                'Kneel': {
                                    message: '{player} chooses to kneel {target}',
                                    gameAction: GameActions.kneelCard(context => ({ card: context.target }))
                                }
                            }
                        })
                    })
                    , context);
            }
        });
    }
}

BattleOfTheCamps.code = '24030';

module.exports = BattleOfTheCamps;
