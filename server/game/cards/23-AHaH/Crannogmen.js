const DrawCard = require('../../drawcard.js');

class Crannogmen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onClaimApplied: event => event.challenge.isMatch({ winner: this.controller, attackingAlone: this })
            },
            target: {
                cardCondition: { type: 'character', unique: false, location: 'play area' },
                gameAction: 'kill'
            },
            cost: ability.costs.putSelfIntoShadows(),
            message: '{player} returns {source} to shadows to kill {target} instead of the normal claim effects',
            handler: context => {
                context.replaceHandler(() => {
                    this.game.killCharacter(context.target);
                });
            }
        });
    }
}

Crannogmen.code = '23011';

module.exports = Crannogmen;
