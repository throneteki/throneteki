import moment from 'moment';

class TimeLimit {
    constructor(game, timeLimitInMinutes, startEvent = 'onSetupFinished') {
        this.game = game;
        this.active = false;
        this.timeLeft = timeLimitInMinutes * 60;
        this.timerStart = null;
        this.paused = false;

        this.game.on(startEvent, () => this.start());
    }

    get isTimeLimitReached() {
        return this.timeLeft <= 0;
    }

    togglePause() {
        this.paused = !this.paused;
        if (this.paused) {
            this.stop();
        } else {
            this.start();
        }
    }

    start() {
        if (!this.active) {
            this.active = true;
            this.timerStart = new Date();

            const timer = setInterval(() => {
                // To avoid a spam-clicking bug that could duplicate this interval, we
                // simply check if the local timer variable (which is unique to each scope) is
                // the most recently set one. If it isn't, then clear it.
                if (timer === this.timer) {
                    this.checkForTimeLimitReached();
                } else {
                    clearInterval(timer);
                }
            }, 1000);
            this.timer = timer;
        }
    }

    stop() {
        if (this.active) {
            this.active = false;
            delete this.timer;
            this.timeLeft = this.calculateTimeLeft();
        }
    }

    checkForTimeLimitReached() {
        if (this.active && this.timer && this.timeLeft > 0) {
            const timeLeft = this.calculateTimeLeft();
            if (timeLeft === 0) {
                this.stop();
                this.game.addAlert(
                    'warning',
                    'Time up. The game will end after the current round has finished'
                );
                // Re-sends the game state to clients due to time expiring
                this.game.timeExpired();

                delete this.timer;
            }
        }
    }

    calculateTimeLeft() {
        // Calculate how much time is remaining
        const timeEndTime = moment(this.timerStart).add(this.timeLeft, 'seconds');
        const timeDifference = moment.duration(timeEndTime.diff(moment())).asSeconds();
        const timeRemaining = Math.max(0, Math.round(timeDifference));

        return timeRemaining;
    }

    getState() {
        return {
            active: this.active,
            paused: this.paused,
            timerStart: this.timerStart,
            timeLeft: this.timeLeft
        };
    }
}

export default TimeLimit;
