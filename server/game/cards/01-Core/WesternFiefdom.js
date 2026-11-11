import { FactionCostReducer } from '../reducer.js';

class WesternFiefdom extends FactionCostReducer {
    // Western Fiefdom (01099)
    // Limited.
    // Marshaling Action: Kneel Western Fiefdom to reduce the cost of the next [lannister] card you
    // marshal this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'lannister');
    }
}

WesternFiefdom.code = '01099';

export default WesternFiefdom;
