const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class BoltonLoyalist extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            cannotBeCanceled: true,
            when: {
                afterChallenge: event => event.challenge.isMatch({ loser: this.controller, challengeType: 'intrigue' })
            },
            message: {
                format: '{player} is forced to give control of {source} to {winner}, or sacrifice another character they control',
                args: { winner: context => context.event.challenge.winner }
            },
            gameAction: GameActions.choose({
                choices: {
                    'Give Control': {
                        message: {
                            format: '{player} gives control of {source} to {winner}',
                            args: { winner: context => context.event.challenge.winner }
                        },
                        gameAction: GameActions.takeControl(context => ({ card: context.source, player: context.event.challenge.winner, context }))
                    },
                    'Sacrifice Character': {
                        gameAction: GameActions.genericHandler(context => {
                            this.game.promptForSelect(context.player, {
                                activePromptTitle: 'Select a character',
                                cardCondition: card => card.getType() === 'character' && card.location === 'play area' && card !== context.source && card.controller === context.player,
                                gameAction: 'sacrifice',
                                onSelect: (player, card) => {
                                    this.game.addMessage('{0} chooses to sacrifice {1}', player, card);
                                    this.game.resolveGameAction(GameActions.sacrificeCard(() => ({ card })), context);
                                    return true;
                                },
                                onCancel: (player) => {
                                    this.game.addAlert('danger', '{0} cancels resolution of {1}', player, context.source);
                                    return true;
                                },
                                source: context.source
                            });
                        })
                    }
                }
            })
        });
    }
}

BoltonLoyalist.code = '25565';
BoltonLoyalist.version = '1.0';

module.exports = BoltonLoyalist;
