import { captureCards } from '../../flip';
import { receiveGameState } from '../reducers/lobby';

const flipMiddleware = () => (next) => (action) => {
    if (receiveGameState.match(action)) {
        captureCards();
    }

    return next(action);
};

export default flipMiddleware;
