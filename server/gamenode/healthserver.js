import http from 'http';
import logger from '../log.js';

const LoopbackAddresses = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

class HealthServer {
    constructor(gameServer, port = 9000) {
        this.gameServer = gameServer;
        this.port = port;
        this.isDraining = false;
        this.server = null;
        this.drainCheckInterval = null;

        // Set up SIGTERM handler
        this.setupSignalHandlers();
    }

    setupSignalHandlers() {
        process.on('SIGTERM', () => {
            logger.info('Received SIGTERM - starting graceful shutdown');
            this.startDraining();
            this.exitWhenEmpty();
        });
    }

    startDraining() {
        if (this.isDraining) {
            return;
        }

        this.isDraining = true;
        logger.info('Node is now draining - will not accept new games');

        // Notify game socket to report draining status to lobby
        if (this.gameServer && this.gameServer.gameSocket) {
            this.gameServer.gameSocket.setDraining(true);
        }
    }

    exitWhenEmpty() {
        if (this.drainCheckInterval) {
            return;
        }

        this.drainCheckInterval = setInterval(() => {
            const numGames = this.getNumGames();
            logger.info(`Draining: ${numGames} games still active`);

            if (numGames === 0) {
                logger.info('All games finished. Shutting down now.');
                clearInterval(this.drainCheckInterval);
                process.exit(0);
            }
        }, 10000); // Check every 10 seconds

        // Safety timeout: force exit after 90 minutes
        setTimeout(
            () => {
                logger.warn('Drain timeout (90 minutes) exceeded. Forcing shutdown.');
                clearInterval(this.drainCheckInterval);
                process.exit(1);
            },
            90 * 60 * 1000
        );
    }

    start() {
        this.server = http.createServer((req, res) => {
            const url = req.url;

            if (url === '/health/alive') {
                this.handleAlive(res);
            } else if (url === '/health/ready') {
                this.handleReady(res);
            } else if (url === '/health/games') {
                this.handleGames(res);
            } else if (url === '/health/drain' && req.method === 'POST') {
                this.handleDrain(req, res);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        });

        this.server.listen(this.port, () => {
            logger.info(`Health check server listening on port ${this.port}`);
        });
    }

    handleAlive(res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                status: 'alive',
                uptime: process.uptime()
            })
        );
    }

    handleReady(res) {
        const isReady = !this.isDraining;
        const statusCode = isReady ? 200 : 503;

        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                ready: isReady,
                draining: this.isDraining,
                numGames: this.getNumGames()
            })
        );
    }

    // Drains without exiting, so the deploy can remove the pod once it is empty. A node that exited
    // would be restarted in the same pod and start accepting games again. Only reachable from inside
    // the pod (the deploy uses kubectl exec), since the health port is open to the cluster.
    handleDrain(req, res) {
        if (!LoopbackAddresses.includes(req.socket.remoteAddress)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Forbidden');
            return;
        }

        this.startDraining();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ draining: true, numGames: this.getNumGames() }));
    }

    handleGames(res) {
        const numGames = this.getNumGames();

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(String(numGames));
    }

    getNumGames() {
        if (!this.gameServer || !this.gameServer.games) {
            return 0;
        }
        return Object.keys(this.gameServer.games).length;
    }

    stop() {
        if (this.drainCheckInterval) {
            clearInterval(this.drainCheckInterval);
        }
        if (this.server) {
            this.server.close();
        }
    }
}

export default HealthServer;
