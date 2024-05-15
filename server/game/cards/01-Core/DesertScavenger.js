import { FactionCharacterCostReducer } from '../reducer.js';

class DesertScavenger extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'martell');
    }
}

DesertScavenger.code = '01110';

export default DesertScavenger;
