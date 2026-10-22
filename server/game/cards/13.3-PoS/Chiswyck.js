import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Chiswyck extends DrawCard {
    // Chiswyck (13049)
    // Pillage.
    // Reaction: After you win a challenge in which Chiswyck is participating, discard the top card
    // of your deck to draw 1 card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.isParticipating() &&
                    event.challenge.isMatch({ winner: context.source.controller }) &&
                    context.source.controller.canDraw()
            },
            cost: ability.costs.discardFromDeck(),
            message: {
                format: '{player} uses {source} and discards {discardFromDeck} to draw 1 card',
                args: { discardFromDeck: (context) => context.costs.discardFromDeck }
            },
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

Chiswyck.code = '13049';

export default Chiswyck;
