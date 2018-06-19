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

    applyClaim(player) {
        if(player !== this.challenge.winner) {
            return false;
        }

        this.game.raiseEvent('onClaimApplied', { player: this.challenge.winner, challenge: this.challenge }, () => {
            this.game.queueStep(new ApplyClaim(this.game, this.challenge));
        });

        return true;
    }

    cancelClaim(player) {
        this.game.addAlert('danger', '{0} continues without applying claim', player, this);

        return true;
    }
}

module.exports = ClaimPrompt;
