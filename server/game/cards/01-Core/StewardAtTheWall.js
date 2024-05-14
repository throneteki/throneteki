import { FactionCharacterCostReducer } from '../reducer.js';

class StewardAtTheWall extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'thenightswatch');
    }
}

StewardAtTheWall.code = '01133';

export default StewardAtTheWall;
