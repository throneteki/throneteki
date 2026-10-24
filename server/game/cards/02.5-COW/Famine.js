import PlotCard from '../../plotcard.js';

class Famine extends PlotCard {
    // Famine (02100)
    // Increase the cost for each opponent to marshal each of his or her characters by 1.
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
