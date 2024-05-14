import DrawCard from '../../drawcard.js';

class Chiswyck extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.isParticipating() &&
                    event.challenge.isMatch({ winner: this.controller }) &&
                    this.controller.canDraw()
            },
            cost: ability.costs.discardFromDeck(),
            message: {
                format: '{player} uses {source} and discards {discardFromDeck} to draw 1 card',
                args: { discardFromDeck: (context) => context.costs.discardFromDeck }
            },
            handler: (context) => {
                context.player.drawCardsToHand(1);
            }
        });
    }
}

Chiswyck.code = '13049';

export default Chiswyck;
