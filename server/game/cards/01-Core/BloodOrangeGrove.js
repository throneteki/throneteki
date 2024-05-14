import { FactionCostReducer } from '../reducer.js';

class BloodOrangeGrove extends FactionCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'martell');
    }
}

BloodOrangeGrove.code = '01118';

export default BloodOrangeGrove;
