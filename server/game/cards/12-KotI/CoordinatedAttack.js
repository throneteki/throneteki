import PlotCard from '../../plotcard.js';
import ChallengeTypes from '../../ChallengeTypes.js';

class CoordinatedAttack extends PlotCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.attackingPlayer === this.controller
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select a challenge type',
                        buttons: ChallengeTypes.asButtons({ method: 'selectChallengeType' }).filter(
                            (button) => button.arg !== context.event.challenge.challengeType
                        )
                    },
                    source: this
                });
            }
        });
    }

    selectChallengeType(player, selectedType) {
        this.untilEndOfPhase((ability) => ({
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge(selectedType)
        }));
        this.game.addMessage(
            '{0} uses {1} to be able to initate an additional {2} challenge this phase',
            player,
            this,
            selectedType
        );

        return true;
    }
}

CoordinatedAttack.code = '12049';

export default CoordinatedAttack;
