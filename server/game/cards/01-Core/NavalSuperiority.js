import PlotCard from '../../plotcard.js';

class NavalSuperiority extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.controller.activePlot === card &&
                (card.hasTrait('Kingdom') || card.hasTrait('Edict')),
            targetController: 'any',
            effect: ability.effects.setBaseGold(0)
        });
    }
}

NavalSuperiority.code = '01017';

export default NavalSuperiority;
