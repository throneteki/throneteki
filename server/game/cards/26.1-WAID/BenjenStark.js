import ChallengeTypes from '../../ChallengeTypes.js';
import DrawCard from '../../drawcard.js';

class BenjenStark extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        winner: this.controller,
                        challengeType: 'military'
                    }) && this.isAttacking()
            },
            handler: (context) => {
                this.opponent = context.event.challenge.loser;
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a challenge type',
                        buttons: ChallengeTypes.asButtons({ method: 'selectedChallenge' })
                    },
                    source: this
                });
            }
        });
    }

    selectedChallenge(player, challengeType) {
        this.game.addMessage(
            '{0} uses {1} to prevent {2} from initiating {3} challenges against them until the end of the phase',
            player,
            this,
            this.opponent,
            challengeType
        );
        this.untilEndOfPhase((ability) => ({
            targetController: this.opponent,
            effect: ability.effects.cannotInitiateChallengeType(
                challengeType,
                (opponent) => opponent === player
            )
        }));
        return true;
    }
}

BenjenStark.code = '26009';

export default BenjenStark;
