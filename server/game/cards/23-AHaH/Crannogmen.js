const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Crannogmen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.winner === context.player && this.isParticipating() &&
                    event.challenge.loser.getTotalInitiative() > this.controller.getTotalInitiative()
            },
            cost: ability.costs.putSelfIntoShadows(),
            target: {
                title: 'Select a character to kill',
                choosingPlayer: (player, context) => player === context.event.challenge.loser,
                cardCondition: (card, context) => card.location === 'play area' &&
                    card.controller === context.event.challenge.loser &&
                    card.getType() === 'character' &&
                    card.isParticipating()
            },
            message: {
                format: '{player} uses {source} to have {loser} choose and kill {target}',
                args: { loser: context => context.event.challenge.loser }
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.kill({ card: context.target, player: context.choosingPlayer }),
                    context
                );
            }
        });
    }
}

Crannogmen.code = '23011';

module.exports = Crannogmen;
