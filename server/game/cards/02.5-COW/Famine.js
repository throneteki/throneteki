import PlotCard from '../../plotcard.js';

class Famine extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.increaseCost({
                playingTypes: 'marshal',
                amount: 1,
                match: (card) => card.getPrintedType() === 'character'
            })
        });
    }
}

Famine.code = '02100';

export default Famine;
