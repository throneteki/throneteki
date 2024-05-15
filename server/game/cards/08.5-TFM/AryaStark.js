import DrawCard from '../../drawcard.js';

class AryaStark extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.kneeled,
            targetController: 'any',
            match: (card) => card.getType() === 'character',
            effect: ability.effects.cannotBeSaved()
        });
    }
}

AryaStark.code = '08081';

export default AryaStark;
