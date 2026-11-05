import { FactionCharacterCostReducer } from '../reducer.js';

class StewardAtTheWall extends FactionCharacterCostReducer {
    // Steward at the Wall (01133)
    // Marshaling Action: Kneel Steward at the Wall to reduce the cost of the next [thenightswatch]
    // character you marshal this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'thenightswatch');
    }
}

StewardAtTheWall.code = '01133';

export default StewardAtTheWall;
