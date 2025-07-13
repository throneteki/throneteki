import moment from 'moment';

class TimeLimit {
    constructor(game, timeLimitInMinutes) {
        this.game = game;
        this.enabled = false;
        this.active = false;
        this.timeLeft = timeLimitInMinutes * 60;
        this.timerStart = null;
        this.paused = false;

        this.game.on('onSetupFinished', () => {
            this.enabled = true;
            this.start();
        });

        this.game.on('onGameOver', () => {
            this.stop();
            this.enabled = false;
        });
    }

    get isTimeLimitReached() {
        return this.timeLeft <= 0;
    }

    togglePause() {
        if (!this.enabled) {
            return;
        }
        this.paused = !this.paused;
        if (this.paused) {
            this.stop();
        } else {
            this.start();
        }
    }

    start() {
        if (!this.enabled) {
            return;
        }
        if (!this.active) {
            this.active = true;
            this.timerStart = new Date();

            this.timer = setInterval(() => {
                this.checkForTimeLimitReached();
            }, 1000);
        }
    }

    stop() {
        if (!this.enabled) {
            return;
        }
        if (this.active) {
            this.active = false;
            clearInterval(this.timer);
            delete this.timer;
            this.timeLeft = this.calculateTimeLeft();
        }
    }

    checkForTimeLimitReached() {
        if (this.enabled && this.active && this.timer && this.timeLeft > 0) {
            const timeLeft = this.calculateTimeLeft();
            if (timeLeft === 0) {
                this.stop();
                this.enabled = false;
                this.game.timeLimitExpired();

                clearInterval(this.timer);
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
        this.checkForTimeLimitReached();
        return {
            active: this.active,
            paused: this.paused,
            timerStart: this.timerStart,
            timeLeft: this.timeLeft
        };
    }
}

export default TimeLimit;
