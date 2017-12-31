const DrawCard = require('../../drawcard.js');

class LionsTooth extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'lannister', unique: true });
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });
        this.action({
            title: 'Return character to owner\'s hand',
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.isParticipating(this.parent)
            ),
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: card => card.getType() === 'character' && card.getPrintedCost() <= 3 && this.game.currentChallenge.isParticipating(card)
            },
            handler: context => {
                this.game.addMessage('{0} sacrifices {1} to return {2} to its owner\'s hand', this.controller, this, context.target);
                context.target.owner.returnCardToHand(context.target);
            }
        });
    }
}

LionsTooth.code = '09030';

module.exports = LionsTooth;
