import DrawCard from '../../drawcard.js';

class TheSwordInTheDarkness extends DrawCard {
    // The Sword in the Darkness (01140)
    // Play only during a challenge in which you control a participating [thenightswatch] character.
    // Reaction: After you win a challenge by 5 or more STR as the defending player, the losing
    // opponent cannot initiate challenges against you this round.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.defendingPlayer === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    this.hasNightsWatchParticipant()
            },
            handler: (context) => {
                let opponent = context.event.challenge.loser;

                this.game.addMessage(
                    '{0} plays {1} to prevent {2} from initiating any more challenges this round',
                    this.controller,
                    this,
                    opponent
                );

                this.untilEndOfRound((ability) => ({
                    targetController: opponent,
                    effect: ability.effects.cannotInitiateChallengeAgainst(this.controller)
                }));
            }
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
