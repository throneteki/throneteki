const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheTrident extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            claim: 1
        });
        this.forcedReaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.attackingPlayer === this.controller
            },
            message: {
                format: '{player} is forced to give control of {source} to {loser}, or sacrifice another location',
                args: { loser: context => context.event.challenge.loser }
            },
            gameAction: GameActions.choose({
                choices: {
                    'Give Control': {
                        message: {
                            format: '{player} gives control of {source} to {loser}',
                            args: { loser: context => context.event.challenge.loser }
                        },
                        gameAction: GameActions.takeControl(context => ({ card: context.source, player: context.event.challenge.loser, context }))
                    },
                    'Sacrifice Location': {
                        gameAction: GameActions.genericHandler(context => {
                            this.game.promptForSelect(context.player, {
                                activePromptTitle: 'Select a location',
                                cardCondition: card => card.getType() === 'location' && card.location === 'play area' && card.controller === context.player && card !== context.source,
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

TheTrident.code = '24028';

module.exports = TheTrident;
