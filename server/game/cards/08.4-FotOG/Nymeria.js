const DrawCard = require('../../drawcard.js');

class Nymeria extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add Direwolfs to challenge',
            condition: () => this.isStarkCardParticipatingInChallenge(),
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.kneelAny(card => card.hasTrait('Direwolf') && card.getType() === 'character' && card !== this)
            ],
            handler: context => {
                let direwolvesToAdd = context.getCostValuesFor('kneel');

                if(this.game.currentChallenge.attackingPlayer === context.player) {
                    for(let card of direwolvesToAdd) {
                        this.game.currentChallenge.addAttacker(card);
                    }
                } else {
                    for(let card of direwolvesToAdd) {
                        this.game.currentChallenge.addDefender(card);
                    }
                }

                this.game.addMessage('{0} kneels {1} to add them to the challenge', context.player, direwolvesToAdd);
            }
        });
    }

    isStarkCardParticipatingInChallenge() {
        return this.game.currentChallenge && this.controller.anyCardsInPlay(card => {
            return this.game.currentChallenge.isParticipating(card) && card.isFaction('stark');
        });
    }
}

Nymeria.code = '08061';

module.exports = Nymeria;
