import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class APlotAgainstTheQueen extends DrawCard {
    // A Plot Against The Queen (08110)
    // Reaction: After you lose a [power] challenge, return a character with 1 or more power to your
    // hand to choose a participating character with 1 or more power and return it to its owner’s
    // hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    event.challenge.challengeType === 'power'
            },
            cost: ability.costs.returnToHand(
                (card) => card.getType() === 'character' && card.power > 0
            ),
            target: {
                cardCondition: (card) => card.isParticipating() && card.power > 0
            },
            message: {
                format: "{player} plays {source} and returns {costs.returnToHand} to their hand to return {target} to {owner}'s hand",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

APlotAgainstTheQueen.code = '08110';

export default APlotAgainstTheQueen;
