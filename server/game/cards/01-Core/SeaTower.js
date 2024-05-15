import { FactionCostReducer } from '../reducer.js';

class SeaTower extends FactionCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'greyjoy');
    }
}

SeaTower.code = '01080';

export default SeaTower;
