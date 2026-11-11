import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

function isParticipatingLannister(source, card) {
    return card.getType() === 'character' && card.isFaction('lannister') && card.isParticipating();
}

class TowerOfTheHand extends DrawCard {
    // Tower of the Hand (03030)
    // Reaction: After you win an [intrigue] challenge, kneel Tower of the Hand and return a
    // participating [lannister] character to your hand to choose a character with lower printed
    // cost controlled by the losing opponent. Return that character to its owner's hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === context.source.controller
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.returnToHand((card, context) =>
                    isParticipatingLannister(context.source, card)
                )
            ],
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.game.currentChallenge.loser &&
                    (!context.costs.returnToHand ||
                        card.getPrintedCost() < context.costs.returnToHand.getPrintedCost())
            },
            message: {
                format: "{player} kneels {source} and returns {returnedCostCard} to their hand to return {target} to {owner}'s hand",
                args: {
                    returnedCostCard: (context) => context.costs.returnToHand,
                    owner: (context) => context.target.owner
                }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

TowerOfTheHand.code = '03030';

export default TowerOfTheHand;
