import { FactionCharacterCostReducer } from '../reducer.js';

class WinterfellSteward extends FactionCharacterCostReducer {
    // Winterfell Steward (01152)
    // Marshaling Action: Kneel Winterfell Steward to reduce the cost of the next [stark] character
    // you marshal this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'stark');
    }
}

WinterfellSteward.code = '01152';

export default WinterfellSteward;
