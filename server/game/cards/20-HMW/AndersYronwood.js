const DrawCard = require('../../drawcard');
const { ChallengeTracker } = require('../../EventTrackers');

class AndersYronwood extends DrawCard {
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

module.exports = AndersYronwood;
