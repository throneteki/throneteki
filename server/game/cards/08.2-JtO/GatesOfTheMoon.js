import DrawCard from '../../drawcard.js';

class GatesOfTheMoon extends DrawCard {
    // Gates of the Moon (08038)
    // Limited.
    // Increase the gold value on each opponent's revealed plot card by 1.
    // +2 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 2
        });

        this.persistentEffect({
            match: (card) => card === card.controller.activePlot,
            targetController: 'opponent',
            effect: ability.effects.modifyGold(1)
        });
    }
}

GatesOfTheMoon.code = '08038';

export default GatesOfTheMoon;
