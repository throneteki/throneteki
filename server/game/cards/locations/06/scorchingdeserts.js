const DrawCard = require('../../../drawcard.js');

class ScorchingDeserts extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: () => true,
                onDefendersDeclared: () => true
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            target: {
                cardCondition: (card, context) => (
                    card.location === 'play area' && 
                    card.getType() === 'character' &&
                    card.getNumberOfIcons() < 2 &&
                    (context.event.name === 'onAttackersDeclared' ? this.game.currentChallenge.isAttacking(card) : this.game.currentChallenge.isDefending(card)) &&
                    card.controller !== this.controller)
            },
            handler: context => {
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage('{0} kneels and sacrifices {1} to remove {2} from the challenge', 
                    this.controller, this, context.target);
            }
        });
    }
}

ScorchingDeserts.code = '06036';

module.exports = ScorchingDeserts;
