const DrawCard = require('../../../drawcard.js');

class Summer extends DrawCard {

    setupCardAbilities(ability) {
        this.action({
            title: 'Have parent participate',
            condition: () => this.game.currentChallenge && this.game.currentChallenge.challengeType === 'military',
            cost: ability.costs.kneelParent(),
            limit: ability.limit.perChallenge(1),
            handler: () => {
                if(this.game.currentChallenge.attackingPlayer === this.controller) {
                    this.game.currentChallenge.addAttacker(this.parent, false);
                } else {
                    this.game.currentChallenge.addDefender(this.parent, false);
                }
                
                this.game.addMessage('{0} uses {1} and kneels {2} to have {2} participate on their side',
                                      this.controller, this, this.parent);
            }
        }),

        this.action({
            title: 'Attach to a different character',
            cost: ability.costs.payGold(1),
            limit: ability.limit.perPhase(1),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => (
                    card.location === 'play area' &&
                    card !== this.parent &&
                    this.canAttach(this.controller, card))
            },
            handler: context => {
                this.controller.attach(this.controller, this, context.target);

                this.game.addMessage('{0} uses {1} and pays 1 gold to attach {1} to {2}',
                                      this.controller, this, this.parent);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('stark') || !card.isUnique()) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Summer.code = '07034';

module.exports = Summer;
