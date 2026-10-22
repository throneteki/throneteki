import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheSwordInTheDarkness extends DrawCard {
    // The Sword in the Darkness (01140)
    // Play only during a challenge in which you control a participating [thenightswatch] character.
    // Reaction: After you win a challenge by 5 or more STR as the defending player, the losing
    // opponent cannot initiate challenges against you this round.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.defendingPlayer === context.source.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    context.source.hasNightsWatchParticipant()
            },
            message: {
                format: '{player} plays {source} to prevent {opponent} from initiating any more challenges this round',
                args: { opponent: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfRound',
                targetController: context.event.challenge.loser,
                effect: ability.effects.cannotInitiateChallengeAgainst(context.player)
            }))
        });
    }

    hasNightsWatchParticipant() {
        return this.game.currentChallenge.defenders.some(
            (card) => card.getType() === 'character' && card.isFaction('thenightswatch')
        );
    }
}

TheSwordInTheDarkness.code = '01140';

export default TheSwordInTheDarkness;
