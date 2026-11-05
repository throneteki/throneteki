import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TrialByCombat extends DrawCard {
    // Trial by Combat (02090)
    // Interrupt: When claim is applied for an [intrigue] challenge, apply [military] claim instead.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge && event.challenge.challengeType === 'intrigue'
            },
            message: {
                format: '{player} plays {source} to have {opponent} apply military claim instead of intrigue claim',
                args: { opponent: (context) => context.event.challenge.defendingPlayer }
            },
            gameAction: GameActions.changeClaimType((context) => ({
                event: context.event,
                challengeType: 'military'
            }))
        });
    }
}

TrialByCombat.code = '02090';

export default TrialByCombat;
