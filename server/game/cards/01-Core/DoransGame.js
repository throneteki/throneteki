import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DoransGame extends DrawCard {
    // Doran's Game (01119)
    // Reaction: After you win an [intrigue] challenge by 5 or more STR, gain X power for your
    // faction. X is the number of plot cards in your used pile. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.strengthDifference >= 5
            },
            message: {
                format: '{player} plays {source} to gain {amount} power for their faction',
                args: { amount: (context) => context.player.getNumberOfUsedPlots() }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: context.player.getNumberOfUsedPlots()
            }))
        });
    }
}

DoransGame.code = '01119';

export default DoransGame;
