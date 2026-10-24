import { FactionCharacterCostReducer } from '../reducer.js';

class GardenCaretaker extends FactionCharacterCostReducer {
    // Garden Caretaker (01188)
    // Marshaling Action: Kneel Garden Caretaker to reduce the cost of the next [tyrell] character
    // you marshal this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'tyrell');
    }
}

GardenCaretaker.code = '01188';

export default GardenCaretaker;
