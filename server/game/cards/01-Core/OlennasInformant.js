const DrawCard = require('../../drawcard.js');
const ChallengeTypes = require('../../ChallengeTypes');

class OlennasInformant extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card === this && this.game.currentPhase === 'challenge'
            },
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Name a challenge type',
                        buttons: ChallengeTypes.asButtons({ method: 'challengeSelected' })
                    },
                    source: this
                });
            }
        });
    }

    challengeSelected(player, challenge) {
        this.untilEndOfPhase((ability) => ({
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge(challenge)
        }));

        this.game.addMessage(
            '{0} uses {1} to be able to initiate an additional {2} challenge this phase',
            player,
            this,
            challenge
        );

        return true;
    }
}

OlennasInformant.code = '01189';

module.exports = OlennasInformant;
