class ChessClock {
    constructor(player, time, delayToStartClock) {
        this.player = player;
        this.mainTime = time * 60;
        this.timeLeft = time * 60;
        this.mode = 'inactive';
        this.timerStart = 0; //when the clock is running, this contains the instant on which it started
        this.paused = false; //has the clock been paused via chat command?
        this.running = false; //is the clock ticking for the player?
        this.stateId = 0;
        this.name = 'ChessClock';
        this.activated = false; //indicates if the game has started/setup is finished
        this.delayToStartClock = delayToStartClock;

        this.player.game.on('onSetupFinished', () => this.activateChessClock());
    }

    activateChessClock() {
        this.activated = true;
    }

    togglePause() {
        if (!this.activated) {
            return;
        }
        this.paused = !this.paused;
        if (this.paused) {
            this.stop();
        }
    }

    modify(secs) {
        this.timeLeft += secs;
    }

    updateStateId() {
        this.stateId++;
    }

    start() {
        if (!this.activated) {
            return;
        }
        if (!this.paused && !this.running) {
            this.mode = 'down';
            this.running = true;
            this.timerStart = Date.now();
            this.updateStateId();
        }
    }

    stop() {
        if (!this.activated) {
            return;
        }
        if (this.timerStart > 0 && this.running) {
            this.running = false;
            this.updateTimeLeft(Math.floor((Date.now() - this.timerStart) / 1000 + 0.5));
            this.timerStart = 0;
            this.updateStateId();
        }
        this.mode = 'stop';
    }

    timeRanOut() {
        this.player.game.addAlert('warning', "{0}'s clock has run out", this.player);
        //TODO make this melee friendly
        this.player.game.recordWinner(this.player.game.getOpponents(this.player)[0], 'time');
        return;
    }

    updateTimeLeft(secs) {
        if (this.timeLeft === 0 || secs < 0) {
            return;
        }
        if (secs <= this.delayToStartClock) {
            return;
        }

        secs = secs - this.delayToStartClock;
        if (this.mode === 'down') {
            this.modify(-secs);
            if (this.timeLeft < 0) {
                this.timeLeft = 0;
                this.timeRanOut();
            }
        }
    }

    getState() {
        return {
            mode: this.mode,
            timeLeft: this.timeLeft,
            stateId: this.stateId,
            mainTime: this.mainTime,
            name: this.name,
            delayToStartClock: this.delayToStartClock
        };
    }
}

export default ChessClock;
