import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MirriMazDuur extends DrawCard {
    // Mirri Maz Duur (02093)
    // Interrupt: When claim is applied for a challenge in which Mirri Maz Duur is attacking alone,
    // choose a character controlled by the losing opponent. Instead of the normal claim effects,
    // kill that character.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: (event, context) =>
                    event.challenge &&
                    event.challenge.isMatch({
                        winner: context.player,
                        attackingAlone: context.source
                    })
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.event.challenge.loser
            },
            message: '{player} uses {source} to kill {target} instead of normal claim effects',
            gameAction: GameActions.replaceEvent((context) => ({
                event: context.event,
                replacement: GameActions.kill({ card: context.target })
            }))
        });
    }
}

MirriMazDuur.code = '02093';

export default MirriMazDuur;
