import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheHandsTourney extends PlotCard {
    // The Hand's Tourney (14051)
    // Forced Interrupt: When claim is applied for a [military] challenge, apply [power] claim
    // instead.
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge && event.challenge.challengeType === 'military'
            },
            message: {
                format: '{attackingPlayer} is forced by {source} to apply power claim instead of military claim',
                args: { attackingPlayer: (context) => context.event.challenge.attackingPlayer }
            },
            gameAction: GameActions.changeClaimType((context) => ({
                event: context.event,
                challengeType: 'power'
            }))
        });
    }
}

TheHandsTourney.code = '14051';

export default TheHandsTourney;
