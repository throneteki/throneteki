import DrawCard from '../../drawcard.js';

class InTheNameOfYourKing extends DrawCard {
    // In the Name of Your King! (02028)
    // Play only during a [military] challenge in which you are the defending player.
    // Action: Kneel your faction card to end this challenge with no winner or loser. Until the end
    // of the phase, you cannot initiate [military] challenges.
    setupCardAbilities(ability) {
        this.action({
            title: 'End challenge',
            condition: () =>
                this.game.isDuringChallenge({
                    challengeType: 'military',
                    defendingPlayer: this.controller
                }),
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.game.currentChallenge.cancelChallenge();
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.cannotInitiateChallengeType('military')
                }));

                this.game.addMessage(
                    '{0} uses {1} to end this challenge with no winner or loser',
                    this.controller,
                    this
                );
            }
        });
    }
}

InTheNameOfYourKing.code = '02028';

export default InTheNameOfYourKing;
