import DrawCard from '../../drawcard.js';

class APlotAgainstTheQueen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
                    event.challenge.challengeType === 'power'
            },
            cost: ability.costs.returnToHand(
                (card) => card.getType() === 'character' && card.power > 0
            ),
            target: {
                cardCondition: (card) => card.isParticipating() && card.power > 0
            },
            handler: (context) => {
                context.target.owner.returnCardToHand(context.target);
                this.game.addMessage(
                    "{0} plays {1} and returns {2} to their hand to return {3} to {4}'s hand",
                    context.player,
                    this,
                    context.costs.returnToHand,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

APlotAgainstTheQueen.code = '08110';

export default APlotAgainstTheQueen;
