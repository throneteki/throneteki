import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class ToTheSpears extends DrawCard {
    // To The Spears! (10024)
    // Play only if there are 3 or more plot cards in your used pile.
    // Challenges Action: Each [martell] character you control does not kneel when declared as an
    // attacker in the next challenge you initiate this phase.
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.action({
            title: 'Have characters not kneel next challenge',
            condition: () => this.controller.getNumberOfUsedPlots() >= 3,
            message:
                '{player} plays {source} to have each martell character they control not kneel when declared as an attacker during the next challenge they initiate this phase',
            handler: (context) => {
                let currentNumber = Math.max(
                    ...this.tracker
                        .filter({ attackingPlayer: context.player })
                        .map((challenge) => challenge.number),
                    0
                );
                let martellCharacters = context.player.filterCardsInPlay(
                    (card) => card.getType() === 'character' && card.isFaction('martell')
                );

                this.untilEndOfPhase((ability) => ({
                    condition: () =>
                        this.game.isDuringChallenge({
                            attackingPlayer: context.player,
                            number: currentNumber + 1
                        }),
                    match: martellCharacters,
                    effect: ability.effects.doesNotKneelAsAttacker()
                }));
            }
        });
    }
}

ToTheSpears.code = '10024';

export default ToTheSpears;
