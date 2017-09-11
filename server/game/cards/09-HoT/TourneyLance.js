const DrawCard = require('../../drawcard.js');

class TourneyLance extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });

        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this.parent) &&
                             this.game.currentChallenge.attackers.length === 1,
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.setChallengerLimit(1)
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.hasTrait('Knight')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

TourneyLance.code = '09021';

module.exports = TourneyLance;
