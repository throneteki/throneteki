import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BySwordOrByGuile extends DrawCard {
    // By Sword or By Guile (27034)
    // Interrupt: When claim is applied for a [military] or [intrigue] challenge in which you
    // control an attacking Army or Dragon character, apply [power] claim instead.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: (event, context) =>
                    event.challenge &&
                    event.challenge.isMatch({
                        attackingPlayer: context.player,
                        challengeType: ['military', 'intrigue']
                    }) &&
                    event.challenge.attackers.some(
                        (card) => card.hasTrait('Army') || card.hasTrait('Dragon')
                    )
            },
            message: '{player} plays {source} to apply power claim instead',
            gameAction: GameActions.changeClaimType((context) => ({
                event: context.event,
                challengeType: 'power'
            }))
        });
    }
}

BySwordOrByGuile.code = '27034';

export default BySwordOrByGuile;
