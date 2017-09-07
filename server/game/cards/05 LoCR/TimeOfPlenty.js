const PlotCard = require('../../plotcard.js');

class TimeOfPlenty extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'draw',
            targetType: 'player',
            targetController: 'any',
            effect: ability.effects.modifyDrawPhaseCards(1)
        });
    }
}

TimeOfPlenty.code = '05051';

module.exports = TimeOfPlenty;
