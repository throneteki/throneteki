import { FactionCostReducer } from '../reducer.js';

class DragonstonePort extends FactionCostReducer {
    // Dragonstone Port (01059)
    // Limited.
    // Marshaling Action: Kneel Dragonstone Port to reduce the cost of the next [baratheon] card you
    // marshal this phase by 1.
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'baratheon');
    }
}

DragonstonePort.code = '01059';

export default DragonstonePort;
