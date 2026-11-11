import PlotCard from '../../plotcard.js';

class MarchingOrders extends PlotCard {
    // Marching Orders (01016)
    // You cannot marshal locations or attachments, or play events.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.cannotMarshal((card) =>
                    ['location', 'attachment'].includes(card.getPrintedType())
                ),
                ability.effects.cannotPlay((card) => card.getPrintedType() === 'event')
            ]
        });
    }
}

MarchingOrders.code = '01016';

export default MarchingOrders;
