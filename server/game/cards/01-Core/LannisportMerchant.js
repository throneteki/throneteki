import { FactionCharacterCostReducer } from '../reducer.js';

class LannisportMerchant extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'lannister');
    }
}

LannisportMerchant.code = '01094';

export default LannisportMerchant;
