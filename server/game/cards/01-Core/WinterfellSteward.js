import { FactionCharacterCostReducer } from '../reducer.js';

class WinterfellSteward extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'stark');
    }
}

WinterfellSteward.code = '01152';

export default WinterfellSteward;
