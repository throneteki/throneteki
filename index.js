import process from 'process';
import runServer from './server/index.js';
import logger from './server/log.js';

// A stray rejected promise from a socket or HTTP handler should not take the whole lobby down
process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', reason);
});

runServer()
    .then(() => {
        logger.info('Server finished startup');
    })
    .catch((err) => {
        logger.error('Server crashed', err);
        process.exit(1);
    });
