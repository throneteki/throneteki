import SatisfyClaim from '../../gamesteps/challenge/SatisfyClaim.js';
import PlotCard from '../../plotcard.js';

class NowItComesToWar extends PlotCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge && ['intrigue', 'power'].includes(event.challenge.challengeType)
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

        this.currentContext.replaceHandler((event) => {
            event.claim.challengeType = 'military';

            this.game.queueStep(new SatisfyClaim(this.game, event.claim));
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
