import { FactionCostReducer } from '../reducer.js';

class RoseGarden extends FactionCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'tyrell');
    }
}

RoseGarden.code = '01194';

export default RoseGarden;
