const PlotCard = require('../../plotcard.js');

const ApplyClaim = require('../../gamesteps/challenge/applyclaim.js');

class NowItComesToWar extends PlotCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onClaimApplied: event => ['intrigue', 'power'].includes(event.challenge.challengeType)
            },
            handler: context => {
                this.currentContext = context;
                this.game.promptWithMenu(context.event.challenge.attackingPlayer, this, {
                    activePrompt: {
                        menuTitle: 'Apply military claim instead?',
                        buttons: [
                            { text: 'Yes', method: 'applyMilitaryClaim' },
                            { text: 'No', method: 'applyNormalClaim' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    applyMilitaryClaim(player) {
        let challenge = this.currentContext.event.challenge;
        this.game.addMessage('{0} chooses to apply {2} claim instead using {1}', player, this, 'military');
        this.currentContext.replaceHandler(() => {
            let replacementChallenge = {
                challengeType: 'military',
                claim: challenge.claim,
                loser: challenge.loser,
                winner: challenge.winner
            };

            this.game.queueStep(new ApplyClaim(this.game, replacementChallenge));
        });
        return true;
    }

    applyNormalClaim(player) {
        let challenge = this.currentContext.event.challenge;
        this.game.addMessage('{0} chooses to apply normal {2} claim using {1}', player, this, challenge.challengeType);
        return true;
    }
}

NowItComesToWar.code = '09050';

module.exports = NowItComesToWar;
