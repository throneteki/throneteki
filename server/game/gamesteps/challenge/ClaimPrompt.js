const BaseStep = require('../basestep');
const ApplyClaim = require('./applyclaim');

class ClaimPrompt extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
    }

    continue() {
        this.game.promptWithMenu(this.challenge.winner, this, {
            activePrompt: {
                menuTitle: 'Perform before claim actions',
                buttons: [
                    { text: 'Apply Claim', method: 'applyClaim' },
                    { text: 'Continue', method: 'cancelClaim' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to apply claim'
        });
    }

    applyClaim() {
        if(this.challenge.allowMultipleOpponentClaim()) {
            this.promptForAdditionalOpponents();
        } else {
            this.processClaim();
        }

        return true;
    }

    cancelClaim(player) {
        this.game.addAlert('danger', '{0} continues without applying claim', player, this);

        return true;
    }

    promptForAdditionalOpponents() {
        let opponents = this.game.getOpponents(this.challenge.winner).filter(opponent => !this.challenge.claimRecipients.includes(opponent));

        if(opponents.length === 0) {
            this.processClaim();
            return true;
        }

        let buttons = opponents.map(opponent => {
            return { text: opponent.name, method: 'addOpponent', arg: opponent.name };
        });

        this.game.promptWithMenu(this.challenge.winner, this, {
            activePrompt: {
                menuTitle: `Apply ${this.challenge.challengeType} claim against additional opponents?`,
                buttons: buttons.concat([
                    { text: 'Done', method: 'processClaim' }
                ])
            },
            waitingPromptTitle: 'Waiting for opponent to apply claim'
        });
    }

    addOpponent(player, opponentName) {
        let opponent = this.game.getPlayerByName(opponentName);

        if(!opponent) {
            return false;
        }

        this.challenge.addClaimRecipient(opponent);

        this.promptForAdditionalOpponents();

        return true;
    }

    processClaim() {
        this.game.raiseEvent('onClaimApplied', { player: this.challenge.winner, challenge: this.challenge }, () => {
            this.game.queueStep(new ApplyClaim(this.game, this.challenge));
        });

        return true;
    }
}

module.exports = ClaimPrompt;
