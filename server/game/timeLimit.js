const moment = require('moment');

class TimeLimit {
    constructor(game) {
        this.game = game;
        this.timeLimitStartType = null;
        this.timeLimitStarted = false;
        this.timeLimitStartedAt = null;
        this.timeLimitInSeconds = null;
        this.isTimeLimitReached = false;
    }

    initialiseTimeLimit(timeLimitStartType, timeLimitInMinutes) {
        this.timeLimitStartType = timeLimitStartType;
        this.timeLimitInSeconds = timeLimitInMinutes * 60;
        if(timeLimitStartType === 'whenSetupFinished') {
            this.game.on('onSetupFinished', () => this.startTimer());
        }
        //todo: implement more kinds of triggers to star the time limit   
    }

    startTimer() {
        if(!this.timeLimitStarted) {
            this.timeLimitStarted = true;
            this.timeLimitStartedAt = new Date();

            this.timer = setInterval(() => {
                this.checkForTimeLimitReached();
            }, 1000);
        }
    }

    togglePause() {
        //pause
        if(this.timeLimitStarted) {
            this.timeLimitStarted = false;
            clearInterval(this.timer);
            this.timer = undefined;
            let differenceBetweenStartOfTimerAndNow = moment.duration(moment().diff(this.timeLimitStartedAt));
            this.timeLimitInSeconds -= Math.floor(differenceBetweenStartOfTimerAndNow.asSeconds());
        } else {
        //unpause
            this.startTimer();
        }
    }

    checkForTimeLimitReached() {
        //only check for the end of the game if the timelimit has not been reached yet
        //and the timer is currently active (not paused)
        if(!this.isTimeLimitReached && this.timeLimitStarted) {
            let differenceBetweenStartOfTimerAndNow = moment.duration(moment().diff(this.timeLimitStartedAt));
            if(differenceBetweenStartOfTimerAndNow.asSeconds() >= this.timeLimitInSeconds) {
                this.game.addAlert('warning', 'Time up.  The game will end after the current round has finished');
                this.isTimeLimitReached = true;
                this.timeLimitStarted = false;
                this.game.timeExpired();
            }
        }
        //clear the timer if the time is up
        if(this.isTimeLimitReached && this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
}

module.exports = TimeLimit;
