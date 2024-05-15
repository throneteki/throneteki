import { FactionCharacterCostReducer } from '../reducer.js';

class GardenCaretaker extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'tyrell');
    }
}

GardenCaretaker.code = '01188';

export default GardenCaretaker;
