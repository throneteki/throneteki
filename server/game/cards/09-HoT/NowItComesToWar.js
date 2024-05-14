import PlotCard from '../../plotcard.js';
import ApplyClaim from '../../gamesteps/challenge/applyclaim.js';

class NowItComesToWar extends PlotCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onClaimApplied: (event) =>
                    ['intrigue', 'power'].includes(event.challenge.challengeType)
            },
            handler: (context) => {
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
        this.game.addMessage(
            '{0} chooses to apply {2} claim instead using {1}',
            player,
            this,
            'military'
        );
        this.currentContext.replaceHandler(() => {
            let replacementClaim = this.currentContext.event.claim.clone();
            replacementClaim.challengeType = 'military';

            this.game.queueStep(new ApplyClaim(this.game, replacementClaim));
        });
        return true;
    }

    applyNormalClaim(player) {
        let challenge = this.currentContext.event.challenge;
        this.game.addMessage(
            '{0} chooses to apply normal {2} claim using {1}',
            player,
            this,
            challenge.challengeType
        );
        return true;
    }
}

NowItComesToWar.code = '09050';

export default NowItComesToWar;
