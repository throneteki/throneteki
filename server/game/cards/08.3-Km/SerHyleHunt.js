const DrawCard = require('../../drawcard.js');

class SerHyleHunt extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from challenge',
            limit: ability.limit.perChallenge(1),
            condition: () => this.isParticipating(),
            cost: ability.costs.payGold(1),
            target: {
                cardCondition: (card) =>
                    card.isParticipating() && card.getStrength() < this.getStrength()
            },
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage(
                    '{0} uses {1} and pays 1 gold to stand and remove {2} from the challenge',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

SerHyleHunt.code = '08043';

module.exports = SerHyleHunt;
