import { FactionCostReducer } from '../reducer.js';

class DragonstonePort extends FactionCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'baratheon');
    }
}

DragonstonePort.code = '01059';

export default DragonstonePort;
