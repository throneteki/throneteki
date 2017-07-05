const DrawCard = require('../../../drawcard.js');

class MaryaSeaworth extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: event => { 
                    this.stealthTargets = event.challenge.getAllStealthTargets(); 
                    return true; 
                }
            },
            cost: ability.costs.payGold(1),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => this.stealthTargets.includes(card)
            },
            limit: ability.limit.perPhase(2),
            handler: context => {
                context.target.controller.kneelCard(context.target);
                this.game.addMessage('{0} uses {1} and pays 1 gold to kneel {2}', this.controller, this, context.target);
            }
        });
    }
}

MaryaSeaworth.code = '07025';

module.exports = MaryaSeaworth;
