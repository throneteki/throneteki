const BaseStep = require('../basestep.js');
const FulfillMilitaryClaim = require('./fulfillmilitaryclaim.js');
const TextHelper = require('../../TextHelper');

class ApplyClaim extends BaseStep {
    constructor(game, claim) {
        super(game);
        this.claim = claim;
    }

    continue() {
        if (this.claim.value === 0) {
            this.game.addMessage('The claim value for {0} is 0', this.claim.challengeType);
            return;
        }

        this.game.claim = {
            isApplying: true,
            type: this.claim.challengeType
        };

        for (let claimRecipient of this.claim.recipients) {
            this.processClaimAgainstPlayer(claimRecipient);
        }

        this.game.queueSimpleStep(() => {
            this.game.claim = {
                isApplying: false,
                type: undefined
            };
        });

        return true;
    }

    processClaimAgainstPlayer(claimRecipient) {
        switch (this.claim.challengeType) {
            case 'military':
                this.game.addMessage(
                    '{0} claim is applied.  {1} must kill {2}',
                    this.claim.challengeType,
                    claimRecipient,
                    TextHelper.count(this.claim.value, 'character')
                );
                this.game.queueStep(
                    new FulfillMilitaryClaim(this.game, claimRecipient, this.claim.value)
                );
                break;
            case 'intrigue':
                this.game.addMessage(
                    '{0} claim is applied.  {1} must discard {2} at random',
                    this.claim.challengeType,
                    claimRecipient,
                    TextHelper.count(this.claim.value, 'card')
                );
                claimRecipient.discardAtRandom(this.claim.value);
                break;
            case 'power': {
                let appliedPower = Math.min(claimRecipient.faction.power, this.claim.value);
                this.game.addMessage(
                    '{0} {1} claim is applied.  {2} removes {3} power and {4} gains {3} power',
                    this.claim.value,
                    this.claim.challengeType,
                    claimRecipient,
                    appliedPower,
                    this.claim.winner
                );
                this.game.movePower(
                    claimRecipient.faction,
                    this.claim.winner.faction,
                    this.claim.value
                );
                break;
            }
        }
    }
}

module.exports = ApplyClaim;
