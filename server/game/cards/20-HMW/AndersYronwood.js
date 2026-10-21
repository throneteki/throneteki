import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class AndersYronwood extends DrawCard {
    // Anders Yronwood (20016)
    // Intimidate.
    // While you are not the first player, each House Yronwood character you control does not kneel
    // when declared as an attacker in the first challenge you initiate each phase.
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' &&
                card.hasTrait('House Yronwood') &&
                card.controller === this.controller,
            condition: () =>
                !this.controller.firstPlayer &&
                !this.tracker.some({ attackingPlayer: this.controller }),
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }
}

AndersYronwood.code = '20016';

export default AndersYronwood;
