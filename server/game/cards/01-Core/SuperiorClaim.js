import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SuperiorClaim extends DrawCard {
    // Superior Claim (01043)
    // Reaction: After you win a [power] challenge by 5 or more STR, gain 2 power for your faction.
    // (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === context.source.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    context.source.controller.canGainFactionPower()
            },
            message: '{player} plays {source} to gain 2 power for their faction',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 2
            }))
        });
    }
}

SuperiorClaim.code = '01043';

export default SuperiorClaim;
