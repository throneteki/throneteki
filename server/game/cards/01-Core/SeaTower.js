import { FactionCostReducer } from '../reducer.js';

class SeaTower extends FactionCostReducer {
    // Sea Tower (01080)
    // Limited.
    // Marshaling Action: Kneel Sea Tower to reduce the cost of the next [greyjoy] card you marshal
    // this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'greyjoy');
    }
}

SeaTower.code = '01080';

export default SeaTower;
