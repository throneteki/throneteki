import AllPlayerPrompt from './allplayerprompt.js';

class CancelChallengePrompt extends AllPlayerPrompt {
    constructor(game, requestingPlayer) {
        super(game);

        this.challenge = game.currentChallenge;
        this.requestingPlayer = requestingPlayer;
        this.completedPlayers = new Set([requestingPlayer]);
        this.cancelled = !this.challenge;
    }

    completionCondition(player) {
        return this.cancelled || this.completedPlayers.has(player);
    }

    activePrompt() {
        return {
            menuTitle: `${this.requestingPlayer.name} requests to cancel the current challenge. Allow cancellation?`,
            buttons: [
                { arg: 'yes', text: 'Yes' },
                { arg: 'no', text: 'No' }
            ]
        };
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponents to approve cancellation'
        };
    }

    onMenuCommand(player, arg) {
        if (arg === 'yes') {
            this.game.addAlert('info', '{0} allows cancelling the current challenge', player);
            this.completedPlayers.add(player);
        } else {
            this.game.addAlert('info', '{0} disallows cancelling the current challenge', player);
            this.cancelled = true;
        }

        return true;
    }

    onCompleted() {
        if (this.cancelled) {
            return;
        }

        this.game.addAlert(
            'danger',
            '{0} cancels the current challenge. Manually stand any knelt characters and work around any abilities already used',
            this.requestingPlayer
        );
        for (let player of this.game.getPlayers()) {
            player.untrackChallenge(this.challenge);
        }
        this.game.currentChallengeStep.cancelChallengeResolution();
    }
}

export default CancelChallengePrompt;
