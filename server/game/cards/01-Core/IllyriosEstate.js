import { FactionCostReducer } from '../reducer.js';

class IllyriosEstate extends FactionCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'targaryen');
    }
}

IllyriosEstate.code = '01175';

export default IllyriosEstate;
