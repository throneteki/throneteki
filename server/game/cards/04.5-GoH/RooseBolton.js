const DrawCard = require('../../drawcard.js');

class RooseBolton extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => {
                    if(event.challenge.winner === this.controller && event.challenge.isAttacking(this)) {
                        this.strengthAtInitiation = this.getStrength();
                        return true;
                    }
                    return false;
                }
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select character(s)',
                maxStat: () => this.strengthAtInitiation,
                cardStat: card => card.getStrength(),
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.controller === this.game.currentChallenge.loser,
                gameAction: 'kill'
            },
            handler: context => {
                this.game.killCharacters(context.target);
                this.game.addMessage('{0} sacrifices {1} to kill {2}', this.controller, this, context.target);
            }
        });
    }
}

RooseBolton.code = '04081';

module.exports = RooseBolton;
