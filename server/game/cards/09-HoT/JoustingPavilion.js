const DrawCard = require('../../drawcard.js');

class JoustingPavilion extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ initiated: true, attackingPlayer: this.controller, match: challenge => challenge.attackers.length === 1 }) 
                || this.game.isDuringChallenge({ initiated: true, defendingPlayer: this.controller, match: challenge => challenge.defenders.length === 1 }),
            match: card => card.hasTrait('Knight') && card.getType() === 'character' && card.isParticipating(),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

JoustingPavilion.code = '09019';

module.exports = JoustingPavilion;
