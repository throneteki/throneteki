import { FactionCharacterCostReducer } from '../reducer.js';

class DragonstoneFaithful extends FactionCharacterCostReducer {
    // Dragonstone Faithful (01056)
    // Marshaling Action: Kneel Dragonstone Faithful to reduce the cost of the next [baratheon]
    // character you marshal this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'baratheon');
    }
}

DragonstoneFaithful.code = '01056';

export default DragonstoneFaithful;
