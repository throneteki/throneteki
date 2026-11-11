import { FactionCharacterCostReducer } from '../reducer.js';

class DesertScavenger extends FactionCharacterCostReducer {
    // Desert Scavenger (01110)
    // Marshaling Action: Kneel Desert Scavenger to reduce the cost of the next [martell] character
    // you marshal this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'martell');
    }
}

DesertScavenger.code = '01110';

export default DesertScavenger;
