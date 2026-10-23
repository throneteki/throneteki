import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class NowItComesToWar extends PlotCard {
    // Now It Comes To War (09050)
    // Forced Interrupt: When claim is applied for an [intrigue] or [power] challenge, the attacking
    // player may choose to apply [military] claim instead.
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge && ['intrigue', 'power'].includes(event.challenge.challengeType)
            },
            gameAction: GameActions.choose({
                player: (context) => context.event.challenge.attackingPlayer,
                title: 'Apply military claim instead?',
                choices: {
                    Yes: {
                        message:
                            '{choosingPlayer} chooses to apply military claim instead using {source}',
                        gameAction: GameActions.changeClaimType((context) => ({
                            event: context.event,
                            challengeType: 'military'
                        }))
                    },
                    No: {
                        message: '{choosingPlayer} chooses to apply normal claim using {source}',
                        gameAction: GameActions.genericHandler(() => true)
                    }
                }
            })
        });
    }
}

NowItComesToWar.code = '09050';

export default NowItComesToWar;
