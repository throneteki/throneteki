import DrawCard from '../../drawcard.js';

class TheStoneDrum extends DrawCard {
    // The Stone Drum (04028)
    // While there is a Kingdom plot card revealed, increase the gold value on your revealed plot
    // card by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.anyPlotHasTrait('Kingdom'),
            match: (card) => card === card.controller.activePlot,
            effect: ability.effects.modifyGold(1)
        });
    }
}

TheStoneDrum.code = '04028';

export default TheStoneDrum;
