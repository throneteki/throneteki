import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Lannisport extends DrawCard {
    // Lannisport (01098)
    // Reaction: After you win an [intrigue] challenge, draw 1 card.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === context.source.controller &&
                    context.source.controller.canDraw()
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

Lannisport.code = '01098';

export default Lannisport;
