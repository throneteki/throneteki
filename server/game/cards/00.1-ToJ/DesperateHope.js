import AgendaCard from '../../agendacard.js';

class DesperateHope extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.setSetupGold(6)
        });

        this.plotModifiers({
            gold: -1,
            initiative: -1,
            reserve: -1
        });
    }
}

DesperateHope.code = '00367';

export default DesperateHope;
