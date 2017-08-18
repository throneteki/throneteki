const TitleCard = require('../../TitleCard.js');

class MasterOfLaws extends TitleCard {
    setupCardAbilities(ability) {
        // TODO: Rivals + Supports
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'draw',
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.modifyDrawPhaseCards(1)
        });
        this.plotModifiers({
            reserve: 1
        });
    }
}

MasterOfLaws.code = '01210';

module.exports = MasterOfLaws;
