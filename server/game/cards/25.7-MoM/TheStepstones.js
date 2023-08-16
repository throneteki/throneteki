const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');

class TheStepstones extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            gold: 2,
            initiative: 1
        });
        this.forcedReaction({
            when: {
                afterChallenge: event => event.challenge.loser === this.controller
            },
            gameAction: GameActions.ifCondition({
                condition: context => context.source.hasToken(Tokens.gold),
                thenAction: GameActions.choose({
                    title: context => `Discard 1 gold for ${context.source.name}?`,
                    choices: {
                        'Yes': {
                            message: '{player} chooses to discard a gold from {source}',
                            gameAction: GameActions.discardToken(context => ({ card: context.source, token: Tokens.gold }))
                        },
                        'No': {
                            message: {
                                format: '{player} chooses to give control of {source} to {winner}',
                                args: { winner: context => context.event.challenge.winner }
                            },
                            gameAction: GameActions.takeControl(context => ({ card: context.source, player: context.event.challenge.winner, context }))
                        }
                    }
                }),
                elseAction: {
                    message: {
                        format: '{player} is forced to give control of {source} to {winner}',
                        args: { winner: context => context.event.challenge.winner }
                    },
                    gameAction: GameActions.takeControl(context => ({ card: context.source, player: context.event.challenge.winner, context }))
                }
            })
        });
    }
}

TheStepstones.code = '25544';
TheStepstones.version = '1.0';

module.exports = TheStepstones;
