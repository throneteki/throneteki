const DrawCard = require('../../drawcard');

class TheDrumm extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({ challengeType: ['military', 'power'] }) &&
                this.isAttacking(),
            match: (card) => card.getType() === 'character' && card.hasIcon('intrigue'),
            targetController: 'any',
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }
}

TheDrumm.code = '12006';

module.exports = TheDrumm;
