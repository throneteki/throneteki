import { FactionCostReducer } from '../reducer.js';

class WesternFiefdom extends FactionCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'lannister');
    }
}

WesternFiefdom.code = '01099';

export default WesternFiefdom;
