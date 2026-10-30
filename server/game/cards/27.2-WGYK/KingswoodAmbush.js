import PlotCard from '../../plotcard.js';

class KingswoodAmbush extends PlotCard {
    // Kingswood Ambush (27039)
    // You cannot marshal characters.
    // Reduce the cost to ambush each of your cards by 2.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cannotMarshal((card) => card.getType() === 'character')
        });
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceCost({
                playingTypes: 'ambush',
                amount: 2
            })
        });
    }
}

KingswoodAmbush.code = '27039';

export default KingswoodAmbush;
