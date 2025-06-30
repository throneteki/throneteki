import DrawCard from '../../drawcard.js';
import ChallengeTypes from '../../ChallengeTypes.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class LysasLetter extends DrawCard {
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            choosePlayer: () => true,
            handler: (context) => {
                this.chosenPlayer = context.chosenPlayer;
                // TODO: Add "chooseChallengeIcon" as a pre-handler choice, as this should be known prior to cancel windows
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select a challenge type',
                        buttons: ChallengeTypes.asButtons({ method: 'setChallengeType' })
                    },
                    source: this
                });
            }
        });
    }

    setChallengeType(player, challengeType) {
        this.game.addMessage(
            '{0} uses {1} to choose {2} and name {3} challenges',
            player,
            this,
            this.chosenPlayer,
            challengeType
        );

        this.untilEndOfPhase((ability) => ({
            condition: () =>
                !this.challengeTypesInitiated(this.chosenPlayer).includes(challengeType),
            match: (card) => card === this.chosenPlayer.activePlot,
            targetController: this.chosenPlayer,
            effect: ability.effects.setClaim(0)
        }));

        return true;
    }

    challengeTypesInitiated(player) {
        let challengesInitiated = this.tracker.filter({ attackingPlayer: player });
        return challengesInitiated.map((challenge) => challenge.challengeType);
    }
}

LysasLetter.code = '23036';

export default LysasLetter;
