const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class AllMenAreFools extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller && 
                    challenge.strengthDifference >= 5 &&
                    this.hasLady())
            },
            handler: () => {
                let ladies = this.controller.filterCardsInPlay(card => card.hasTrait('Lady') && card.getType() === 'character');

                _.each(ladies, card => {
                    card.modifyPower(1);
                });

                this.game.addMessage('{0} plays {1} to have {2} gain 1 power',
                                      this.controller, this, ladies);
            }
        });
    }

    hasLady() {
        return this.controller.anyCardsInPlay(card => card.hasTrait('Lady') && card.getType() === 'character');
    }
}

AllMenAreFools.code = '06004';

module.exports = AllMenAreFools;
