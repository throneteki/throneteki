const runServer = require('./server');

const run = async () => {
    console.info('about to start');
    await runServer();
    console.info('runserver finished');
};

run()
    .then(() => {
        console.info('Shutting down');
    })
    .catch((err) => {
        console.info(err);
    });

console.info('probably shouldnt be here');
