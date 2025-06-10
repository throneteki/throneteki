import moment from 'moment';

class ChessClock {
    constructor(player, timeLimitInMinutes, delay, startEvent = 'onSetupFinished') {
        this.player = player;
        this.enabled = false; // Clocks are disabled until start event hit
        this.active = false; // Clock is active when that player has the current window
        this.timeLeft = timeLimitInMinutes * 60;
        this.delay = delay;
        this.delayLeft = this.delay;
        this.timerStart = null;
        this.paused = false;

        this.player.game.on(startEvent, () => (this.enabled = true));
    }

    togglePause() {
        if (!this.enabled) {
            return;
        }
        this.paused = !this.paused;
        // Only start/stop timer when active
        if (this.active) {
            if (this.paused) {
                this.stopTimer();
            } else {
                this.startTimer();
            }
        }
    }

    start() {
        if (!this.enabled) {
            return;
        }
        if (!this.active) {
            this.active = true;
            this.delayLeft = this.delay;
            this.startTimer();
        }
    }

    startTimer() {
        this.timerStart = new Date();
        this.timer = setInterval(() => {
            this.checkForTimeRanOut();
        }, 1000);
    }

    stop() {
        if (!this.enabled) {
            return;
        }
        if (this.active) {
            this.active = false;
            this.stopTimer();
        }
    }

    stopTimer() {
        clearInterval(this.timer);
        delete this.timer;
        const { timeRemaining, delayRemaining } = this.calculateTimeLeft();
        this.timeLeft = timeRemaining;
        this.delayLeft = delayRemaining;
    }

    checkForTimeRanOut() {
        if (this.active && this.timer && this.timeLeft > 0) {
            const { timeRemaining } = this.calculateTimeLeft();
            if (timeRemaining === 0) {
                this.stop();
                this.player.game.addAlert('warning', "{0}'s clock has run out", this.player);
                this.player.game.eliminate(this.player);
                // Check if there is only one non-eliminated player remaining. If so, they win!
                const remainingPlayers = this.player.game.getPlayers();
                if (remainingPlayers.length === 1) {
                    this.player.game.recordWinner(remainingPlayers[0], 'time');
                }
                // Re-sends the game state to clients due to time expiring
                this.player.game.timeExpired();

                clearInterval(this.timer);
                delete this.timer;
            }
        }
    }

    calculateTimeLeft() {
        // Calculate how much delay is remaining
        const delayEndTime = moment(this.timerStart).add(this.delayLeft, 'seconds');
        const delayDifference = moment.duration(delayEndTime.diff(moment())).asSeconds();
        const delayRemaining = Math.max(0, Math.round(delayDifference));

        // Calculate how much time is remaining (with remaining delay taken into account)
        const timeEndTime = delayEndTime
            .add(this.timeLeft, 'seconds')
            .add(-delayRemaining, 'seconds');
        const timeDifference = moment.duration(timeEndTime.diff(moment())).asSeconds();
        const timeRemaining = Math.max(0, Math.round(timeDifference));

        return { timeRemaining, delayRemaining };
    }

    getState() {
        this.checkForTimeRanOut();
        return {
            active: this.active,
            paused: this.paused,
            timerStart: this.timerStart,
            timeLeft: this.timeLeft,
            delayLeft: this.delayLeft
        };
    }
}

export default ChessClock;
