import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Crannogmen extends DrawCard {
    // Crannogmen (23011)
    // Shadow (3).
    // Interrupt: When claim is applied for an [intrigue] challenge in which Crannogmen is
    // attacking, return it to shadows to choose a character with printed cost 3 or lower controlled
    // by the losing opponent. Instead of the normal claim effects, kill that character.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: (event, context) =>
                    event.challenge &&
                    event.challenge.isMatch({
                        winner: context.player,
                        challengeType: 'intrigue'
                    }) &&
                    context.source.isAttacking()
            },
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    printedCostOrLower: 3,
                    condition: (card, context) => card.controller === context.event.challenge.loser
                }
            },
            cost: ability.costs.putSelfIntoShadows(),
            message:
                '{player} returns {source} to shadows to kill {target} instead of the normal claim effects',
            gameAction: GameActions.replaceEvent((context) => ({
                event: context.event,
                replacement: GameActions.kill({ card: context.target })
            }))
        });
    }
}

Crannogmen.code = '23011';

export default Crannogmen;
