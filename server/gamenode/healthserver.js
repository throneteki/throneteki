import http from 'http';
import logger from '../log.js';
import fs from 'fs';

class HealthServer {
    constructor(gameServer, port = 9000) {
        this.gameServer = gameServer;
        this.port = port;
        this.isDraining = false;
        this.server = null;
        this.drainingFile = '/tmp/draining';

        if (fs.existsSync(this.drainingFile)) {
            this.isDraining = true;
            logger.info('Draining file detected on startup - node is in draining mode');
        }

        this.watchDrainingFile();
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

    watchDrainingFile() {
        setInterval(() => {
            const exists = fs.existsSync(this.drainingFile);
            if (exists && !this.isDraining) {
                logger.info('Draining file detected - marking node as draining');
                this.isDraining = true;
                this.notifyGameSocketDraining();
            }
        }, 1000);
    }

    notifyGameSocketDraining() {
        if (this.gameServer && this.gameServer.gameSocket) {
            this.gameServer.gameSocket.setDraining(true);
        }
    }

    stop() {
        if (this.server) {
            this.server.close();
        }
    }
}

export default HealthServer;
