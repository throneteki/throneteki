const DrawCard = require('../../drawcard.js');

class TheSwordInTheDarkness extends DrawCard {
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

module.exports = TheSwordInTheDarkness;
