const DrawCard = require('../../drawcard.js');

class KnightOfTheReach extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({ winner: this.controller, attackingAlone: this }) ||
                    event.challenge.isMatch({ winner: this.controller, defendingAlone: this })
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Lady') &&
                    card.getType() === 'character',
                gameAction: 'gainPower'
            },
            handler: (context) => {
                context.target.modifyPower(1);
                this.game.addMessage(
                    '{0} uses {1} to have {2} gain 1 power',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

KnightOfTheReach.code = '06023';

module.exports = KnightOfTheReach;
