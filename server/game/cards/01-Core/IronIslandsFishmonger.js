import { FactionCharacterCostReducer } from '../reducer.js';

class IronIslandsFishmonger extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'greyjoy');
    }
}

IronIslandsFishmonger.code = '01074';

export default IronIslandsFishmonger;
