import TitleCard from '../../TitleCard.js';

class MasterOfLaws extends TitleCard {
    // Master of Laws (01210)
    // Supported by Hand of the King
    // Supports: Master of Coin
    // Rivals: Master of Whispers, Master of Ships
    // Increase the number of cards you draw in the draw phase by 1.
    // +1 Reserve.
    setupCardAbilities(ability) {
        this.supports('Master of Coin');
        this.rivals('Master of Whispers', 'Master of Ships');
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.modifyDrawPhaseCards(1)
        });
        this.plotModifiers({
            reserve: 1
        });
    }
}

MasterOfLaws.code = '01210';

export default MasterOfLaws;
