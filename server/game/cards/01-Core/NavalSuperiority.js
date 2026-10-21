import PlotCard from '../../plotcard.js';

class NavalSuperiority extends PlotCard {
    // Naval Superiority (01017)
    // Treat the base gold value on each revealed Kingdom and each revealed Edict plot card as if it
    // were 0.
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
