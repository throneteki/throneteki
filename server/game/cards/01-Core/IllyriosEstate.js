import { FactionCostReducer } from '../reducer.js';

class IllyriosEstate extends FactionCostReducer {
    // Illyrio's Estate (01175)
    // Limited.
    // Marshaling Action: Kneel Illyrio's Estate to reduce the cost of the next [targaryen] card you
    // marshal this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'targaryen');
    }
}

IllyriosEstate.code = '01175';

export default IllyriosEstate;
