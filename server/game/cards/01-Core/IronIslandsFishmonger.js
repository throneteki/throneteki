import { FactionCharacterCostReducer } from '../reducer.js';

class IronIslandsFishmonger extends FactionCharacterCostReducer {
    // Iron Islands Fishmonger (01074)
    // Marshaling Action: Kneel Iron Islands Fishmonger to reduce the cost of the next [greyjoy]
    // character you marshal this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'greyjoy');
    }
}

IronIslandsFishmonger.code = '01074';

export default IronIslandsFishmonger;
