import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TyrionLannister extends DrawCard {
    // Tyrion Lannister (00011)
    // Stealth.
    // Reaction: After you win an [intrigue] challenge or a challenge in which Tyrion Lannister is
    // participating, pay 1 gold to draw 1 card.
    // Draft format only.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    (event.challenge.challengeType === 'intrigue' ||
                        context.source.isParticipating()) &&
                    context.source.controller.canDraw()
            },
            cost: ability.costs.payGold(1),
            message: '{player} uses {source} and pays 1 gold to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

TyrionLannister.code = '00011';

export default TyrionLannister;
