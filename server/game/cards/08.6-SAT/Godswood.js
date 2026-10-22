import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class Godswood extends DrawCard {
    // Godswood (08102)
    // Reaction: After you win a challenge as the attacking player, if there are more Winter plot
    // cards than Summer plot cards revealed, kneel Godswood to draw X cards. X is the claim value
    // on your revealed plot card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.attackingPlayer === context.player &&
                    context.game.getNumberOfPlotsWithTrait('Winter') >
                        context.game.getNumberOfPlotsWithTrait('Summer')
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to draw {amount}',
                args: { amount: (context) => TextHelper.count(context.player.getClaim(), 'card') }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: context.player.getClaim()
            }))
        });
    }
}

Godswood.code = '08102';

export default Godswood;
