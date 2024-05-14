const PlotCard = require('../../plotcard');

class DesperateAttack extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ defendingPlayer: this.controller }),
            match: (card) => card === this.game.currentChallenge.attackingPlayer.activePlot,
            targetController: 'any',
            effect: ability.effects.modifyClaim(1)
        });
    }
}

DesperateAttack.code = '14050';

module.exports = DesperateAttack;
