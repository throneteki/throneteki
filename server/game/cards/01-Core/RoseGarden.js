import { FactionCostReducer } from '../reducer.js';

class RoseGarden extends FactionCostReducer {
    // Rose Garden (01194)
    // Limited.
    // Marshaling Action: Kneel Rose Garden to reduce the cost of the next [tyrell] card you marshal
    // this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'tyrell');
    }
}

RoseGarden.code = '01194';

export default RoseGarden;
