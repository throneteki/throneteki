const runServer = require('./server');

const run = async () => {
    await runServer();
};

run()
    .then(() => {
        console.info('Shutting down');
    })
    .catch((err) => {
        console.info(err);
    });
