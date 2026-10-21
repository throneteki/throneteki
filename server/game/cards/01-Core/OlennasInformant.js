import DrawCard from '../../drawcard.js';
import ChallengeTypes from '../../ChallengeTypes.js';

class OlennasInformant extends DrawCard {
    // Olenna's Informant (01189)
    // Ambush (4).
    // Reaction: After Olenna's Informant enters play during the challenges phase, name a challenge
    // type. You may initiate an additional challenge of that type this phase.
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

export default OlennasInformant;
