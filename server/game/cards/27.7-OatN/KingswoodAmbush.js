import PlotCard from '../../plotcard.js';

class KingswoodAmbush extends PlotCard {
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

KingswoodAmbush.code = '27612';

export default KingswoodAmbush;
