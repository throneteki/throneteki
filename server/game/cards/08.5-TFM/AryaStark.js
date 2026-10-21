import DrawCard from '../../drawcard.js';

class AryaStark extends DrawCard {
    // Arya Stark (08081)
    // While Arya Stark is standing, characters cannot be saved.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.source.kneeled,
            targetController: 'any',
            match: (card) => card.getType() === 'character',
            effect: ability.effects.cannotBeSaved()
        });
    }
}

AryaStark.code = '08081';

export default AryaStark;
