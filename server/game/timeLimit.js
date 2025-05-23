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

            this.timer = setInterval(() => {
                this.checkForTimeLimitReached();
            }, 1000);
        }
    }

    stop() {
        if (this.active) {
            this.active = false;
            clearInterval(this.timer);
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
