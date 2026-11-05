import { FactionCostReducer } from '../reducer.js';

class BloodOrangeGrove extends FactionCostReducer {
    // Blood Orange Grove (01118)
    // Limited.
    // Marshaling Action: Kneel Blood Orange Grove to reduce the cost of the next [martell] card you
    // marshal this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'martell');
    }
}

BloodOrangeGrove.code = '01118';

export default BloodOrangeGrove;
