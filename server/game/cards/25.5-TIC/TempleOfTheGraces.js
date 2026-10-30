import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TempleOfTheGraces extends DrawCard {
    // Temple of the Graces (25094)
    // Interrupt: When claim is applied for a [military] challenge in which you are the attacking
    // player, kneel a Grace card to apply [intrigue] claim instead.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: (event, context) =>
                    event.challenge &&
                    event.challenge.challengeType === 'military' &&
                    event.challenge.attackingPlayer === context.player
            },
            cost: ability.costs.kneel((card) => card.hasTrait('Grace')),
            message:
                '{player} uses {source} and kneels {costs.kneel} to apply intrigue claim instead of military claim',
            gameAction: GameActions.changeClaimType((context) => ({
                event: context.event,
                challengeType: 'intrigue'
            }))
        });
    }
}

TempleOfTheGraces.code = '25094';

export default TempleOfTheGraces;
