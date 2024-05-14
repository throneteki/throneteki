import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Darkstar extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return each participating character to hand',
            condition: () => this.isAttacking(),
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: "{player} sacrifices {costs.sacrifice} to return {participants} to its owner's hand",
                args: { participants: (context) => context.game.currentChallenge.getParticipants() }
            },
            gameAction: GameActions.simultaneously((context) =>
                context.game.currentChallenge
                    .getParticipants()
                    .map((card) => GameActions.returnCardToHand({ card }))
            )
        });
    }
}

Darkstar.code = '10004';

export default Darkstar;
