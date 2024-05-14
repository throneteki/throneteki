import { FactionCharacterCostReducer } from '../reducer.js';

class TargaryenLoyalist extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'targaryen');
    }
}

TargaryenLoyalist.code = '01170';

export default TargaryenLoyalist;
