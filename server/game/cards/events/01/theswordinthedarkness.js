const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class TheSwordInTheDarkness extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.defendingPlayer === this.controller &&
                    challenge.strengthDifference >= 5 &&
                    this.hasNightsWatchParticipant()
                )
            },
            handler: () => {
                let opponent = this.game.getOtherPlayer(this.controller);

                if(!opponent) {
                    return;
                }

                this.game.addMessage('{0} uses {1} to prevent {2} from initiating any more challenges this round', this.controller, this, opponent);

                this.untilEndOfRound(ability => ({
                    targetType: 'player',
                    targetController: 'opponent',
                    effect: ability.effects.setMaxChallenge(0)
                }));
            }
        });
    }

    hasNightsWatchParticipant() {
        return _.any(this.game.currentChallenge.defenders, card => card.getType() === 'character' && card.isFaction('thenightswatch'));
    }
}

TheSwordInTheDarkness.code = '01140';

module.exports = TheSwordInTheDarkness;
