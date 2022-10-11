const DrawCard = require('../../drawcard');

class TheEyrie extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -2,
            reserve: 1
        });

        this.persistentEffect({
            condition: () => this.controller.getTotalInitiative() === 0,
            match: this,
            effect: ability.effects.immuneTo(() => true)
        });

        this.action({
            title: 'Contribute 3 STR',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            condition: () => this.game.isDuringChallenge() && this.game.currentChallenge.anyParticipants(card => card.controller === this.controller),
            message: '{player} kneels {source} to have it contribute 3 STR to {player}\'s side of the challenge',
            handler: () => {
                // TODO: Update this (contribute strength) to a GameAction
                this.untilEndOfChallenge(ability => ({
                    condition: () => true,
                    targetController: 'current',
                    effect: ability.effects.contributeChallengeStrength(3)
                }));
            }
        });
    }
}

TheEyrie.code = '23031';

module.exports = TheEyrie;
