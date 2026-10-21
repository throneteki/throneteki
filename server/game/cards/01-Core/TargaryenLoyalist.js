import { FactionCharacterCostReducer } from '../reducer.js';

class TargaryenLoyalist extends FactionCharacterCostReducer {
    // Targaryen Loyalist (01170)
    // Marshaling Action: Kneel Targaryen Loyalist to reduce the cost of the next [targaryen]
    // character you marshal this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'targaryen');
    }
}

TargaryenLoyalist.code = '01170';

export default TargaryenLoyalist;
