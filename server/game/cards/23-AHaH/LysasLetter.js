import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';
import GameActions from '../../GameActions/index.js';

class LysasLetter extends DrawCard {
    // Lysa's Letter (23036)
    // Reaction: After the challenges phase begins, choose a player and a challenge type. Until the
    // end of the phase, if that player has not initiated a challenge of that type this phase, set
    // the claim value on their revealed plot card to 0.
    setupCardAbilities(ability) {
        const tracker = ChallengeTracker.forPhase(this.game);

        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            choosePlayer: true,
            gameAction: GameActions.chooseChallengeType({
                message:
                    '{player} uses {source} to choose {chosenPlayer} and name {challengeType} challenges',
                gameAction: (challengeType) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        condition: () =>
                            !tracker.some({ attackingPlayer: context.chosenPlayer, challengeType }),
                        match: (card) => card === context.chosenPlayer.activePlot,
                        targetController: context.chosenPlayer,
                        effect: ability.effects.setClaim(0)
                    }))
            })
        });
    }
}

LysasLetter.code = '23036';

export default LysasLetter;
