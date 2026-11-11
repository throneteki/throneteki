import { FactionCharacterCostReducer } from '../reducer.js';

class LannisportMerchant extends FactionCharacterCostReducer {
    // Lannisport Merchant (01094)
    // Marshaling Action: Kneel Lannisport Merchant to reduce the cost of the next [lannister]
    // character you marshal this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'lannister');
    }
}

LannisportMerchant.code = '01094';

export default LannisportMerchant;
