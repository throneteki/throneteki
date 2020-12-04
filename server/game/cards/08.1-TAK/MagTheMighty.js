const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class MagTheMighty extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isParticipating()
            },
            target: {
                cardCondition: card => card.location === 'play area' && card.controller === this.controller && card.getType() === 'character',
                gameAction: 'kill'
            },
            message: '{player} uses {source} to kill {target}',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.kill(context => ({
                        card: context.target
                    })).then(preThenContext => ({
                        target: {
                            cardCondition: { location: 'play area', type: 'character', controller: preThenContext.event.challenge.loser },
                            gameAction: 'kill'
                        },
                        message: 'Then {player} uses {source} to kill {target}',
                        handler: context => {
                            this.game.resolveGameAction(
                                GameActions.kill(context => ({ card: context.target })),
                                context
                            );
                        }
                    })),
                    context
                );
            }
        });
    }
}

MagTheMighty.code = '08018';

module.exports = MagTheMighty;
