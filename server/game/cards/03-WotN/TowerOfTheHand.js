const DrawCard = require('../../drawcard.js');

class TowerOfTheHand extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === this.controller
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.returnToHand((card) => this.isParticipatingLannister(card))
            ],
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.game.currentChallenge.loser &&
                    (!context.costs.returnToHand ||
                        card.getPrintedCost() < context.costs.returnToHand.getPrintedCost())
            },
            handler: (context) => {
                let returnedCostCard = context.costs.returnToHand;
                context.target.owner.returnCardToHand(context.target);
                this.game.addMessage(
                    "{0} kneels {1} and returns {2} to their hand to return {3} to {4}'s hand",
                    this.controller,
                    this,
                    returnedCostCard,
                    context.target,
                    context.target.owner
                );
            }
        });
    }

    isParticipatingLannister(card) {
        return (
            card.getType() === 'character' && card.isFaction('lannister') && card.isParticipating()
        );
    }
}

TowerOfTheHand.code = '03030';

module.exports = TowerOfTheHand;
