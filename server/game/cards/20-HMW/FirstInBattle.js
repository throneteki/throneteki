import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';
import GameActions from '../../GameActions/index.js';

class FirstInBattle extends DrawCard {
    // First in Battle (20039)
    // Play only if you control 3 or more The Reach locations.
    // Challenges Action: Each Army or House Tarly character you control does not kneel when
    // declared as an attacker in the first challenge you initiate this phase.
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.action({
            phase: 'challenge',
            condition: (context) => context.source.getNumberOfReach() >= 3,
            message:
                '{player} plays {source} to have each Army or House Tarly character they control not kneel during the first challenge they initiate this phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                condition: () => context.source.isAttackingInFirstChallenge(),
                match: (card) =>
                    card.getType() === 'character' &&
                    (card.hasTrait('Army') || card.hasTrait('House Tarly')),
                effect: ability.effects.doesNotKneelAsAttacker()
            }))
        });
    }

    getNumberOfReach() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'location' && card.hasTrait('The Reach')
        );
    }

    isAttackingInFirstChallenge() {
        return !this.tracker.some({ attackingPlayer: this.controller });
    }
}

FirstInBattle.code = '20039';

export default FirstInBattle;
