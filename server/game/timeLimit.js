const moment = require('moment');

class TimeLimit {
    constructor(game) {
        this.game = game;
        this.timeLimitStartType = null;
        this.timeLimitStarted = false;
        this.timeLimitStartedAt = null;
        this.timeLimitInMinutes = null;
        this.isTimeLimitReached = false;
    }

    initialiseTimeLimit(timeLimitStartType, timeLimitInMinutes) {
        this.timeLimitStartType = timeLimitStartType;
        this.timeLimitInMinutes = timeLimitInMinutes;
        if(timeLimitStartType === 'whenSetupFinished') {
            this.game.on('onSetupFinished', () => this.startTimer());
        }
        //todo: implement more kinds of triggers to star the time limit   
    }

    startTimer() {
        if(!this.timeLimitStarted) {
            this.timeLimitStarted = true;
            this.timeLimitStartedAt = new Date();
            this.game.addMessage('Time limit of {0} minutes starts now!', this.timeLimitInMinutes);
        }
    }

    checkForTimeLimitReached() {
        if(this.game.useGameTimeLimit && !this.isTimeLimitReached) {
            let differenceBetweenStartOfTimerAndNow = moment.duration(moment().diff(this.timeLimitStartedAt));
            if(differenceBetweenStartOfTimerAndNow.asSeconds() / 60 >= this.timeLimitInMinutes) {
                this.game.addMessage('Time limit of {0} minutes reached, the game will end after the current round has finished!', this.timeLimitInMinutes);
                this.isTimeLimitReached = true;
                this.game.on('onRoundEnded', () => this.handleEndOfRoundWhenTimeLimitIsReached());
            }
        }
    }

    handleEndOfRoundWhenTimeLimitIsReached() {
        if(!this.game.isFinished) {
            //todo: check for win condition in case of time called, for example who is closer to 15 power or in case of draw, who has more cards left in his/her deck
            this.game.addMessage('Please determine the winner based on who is closer to 15 power or, in case of a draw, who has more cards left in his/her deck.');
        }
    }
}

module.exports = TimeLimit;
