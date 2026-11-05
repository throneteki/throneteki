import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MyaStone extends DrawCard {
    // Mya Stone (08117)
    // Interrupt: When claim is applied for a [military] or [intrigue] challenge in which you are
    // the defending player, kneel Mya Stone to apply [power] claim instead.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: (event, context) =>
                    event.challenge &&
                    ['military', 'intrigue'].includes(event.challenge.challengeType) &&
                    event.challenge.defendingPlayer === context.player
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to apply power claim instead of {challengeType} claim',
                args: { challengeType: (context) => context.event.challenge.challengeType }
            },
            gameAction: GameActions.changeClaimType((context) => ({
                event: context.event,
                challengeType: 'power'
            }))
        });
    }
}

MyaStone.code = '08117';

export default MyaStone;
