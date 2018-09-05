const DrawCard = require('../../drawcard');

class WunWun extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Wun Wun to have him participate in the current challenge',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            condition: () => this.isWildlingdParticipatingInChallenge(),
            cost: ability.costs.kneelSelf(),
            handler: context => {
                let card = context.costs.kneel;
                if(this.game.currentChallenge.attackingPlayer === context.player) {
                    this.game.currentChallenge.addAttacker(card);
                } else {
                    this.game.currentChallenge.addDefender(card);
                }

                this.game.addMessage('{0} uses {1} to kneel {2} and add them to the challenge', context.player, this, card);
            }
        });
    }

    isWildlingdParticipatingInChallenge() {
        return this.controller.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('wildling'));
    }
}

WunWun.code = '11077';

module.exports = WunWun;
