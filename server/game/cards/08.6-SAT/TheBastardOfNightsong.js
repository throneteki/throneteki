import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheBastardOfNightsong extends DrawCard {
    // The Bastard of Nightsong (08107)
    // Reaction: After you win a [power] challenge in which The Bastard of Nightsong is
    // participating, move 1 power from the losing opponent’s faction card to your own.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'power' &&
                    context.source.isParticipating() &&
                    event.challenge.loser.faction.power > 0
            },
            message: {
                format: "{player} uses {source} to move 1 power from {otherPlayer}'s faction to their own",
                args: { otherPlayer: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.event.challenge.loser.faction,
                to: context.player.faction,
                amount: 1
            }))
        });
    }
}

TheBastardOfNightsong.code = '08107';

export default TheBastardOfNightsong;
