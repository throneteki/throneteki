import { FactionCostReducer } from '../reducer.js';

class HeartTreeGrove extends FactionCostReducer {
    // Heart Tree Grove (01156)
    // Limited.
    // Marshaling Action: Kneel Heart Tree Grove to reduce the cost of the next [stark] card you
    // marshal this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'stark');
    }
}

HeartTreeGrove.code = '01156';

export default HeartTreeGrove;
