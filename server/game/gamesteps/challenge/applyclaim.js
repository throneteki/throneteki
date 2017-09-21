const BaseStep = require('../basestep.js');
const FulfillMilitaryClaim = require('./fulfillmilitaryclaim.js');

class ApplyClaim extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
    }

    continue() {
        if(this.challenge.claim === 0) {
            this.game.addMessage('The claim value for {0} is 0', this.challenge.challengeType);
            return;
        }

        this.game.claim = {
            isApplying: true,
            type: this.challenge.challengeType
        };

        switch(this.challenge.challengeType) {
            case 'military':
                this.game.addMessage('{0} claim is applied.  {1} must kill {2} character{3}', this.challenge.challengeType, this.challenge.loser, this.challenge.claim,
                    this.challenge.claim > 1 ? 's' : '');
                this.game.queueStep(new FulfillMilitaryClaim(this.game, this.challenge.loser, this.challenge.claim));
                break;
            case 'intrigue':
                this.game.addMessage('{0} claim is applied.  {1} must discard {2} card{3} at random', this.challenge.challengeType, this.challenge.loser, this.challenge.claim,
                    this.challenge.claim > 1 ? 's' : '');
                this.challenge.loser.discardAtRandom(this.challenge.claim);
                break;
            case 'power': {
                let appliedPower = Math.min(this.challenge.loser.faction.power, this.challenge.claim);
                this.game.addMessage('{0} {1} claim is applied.  {2} removes {3} power and {4} gains {3} power', this.challenge.claim, this.challenge.challengeType, this.challenge.loser, appliedPower,
                    this.challenge.winner);
                this.game.movePower(this.challenge.loser.faction, this.challenge.winner.faction, this.challenge.claim);
                break;
            }
        }

        this.game.queueSimpleStep(() => {
            this.game.claim = {
                isApplying: false,
                type: undefined
            };
        });

        return true;
    }
}

module.exports = ApplyClaim;
