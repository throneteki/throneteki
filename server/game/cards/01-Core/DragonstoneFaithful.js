import { FactionCharacterCostReducer } from '../reducer.js';

class DragonstoneFaithful extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'baratheon');
    }
}

DragonstoneFaithful.code = '01056';

export default DragonstoneFaithful;
