import ChallengeTypes from '../../ChallengeTypes.js';
import DrawCard from '../../drawcard.js';
import SatisfyClaim from '../../gamesteps/challenge/SatisfyClaim.js';

class WolvesInTheHills extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: () => true
            },
            cost: ability.costs.returnToHand((card) => this.isValidCharacter(card)),
            message:
                '{player} plays {source} and returns {costs.returnToHand} to their hand to change the apply claim of a different challenge type instead',
            handler: (context) => {
                this.context = context;
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Name a challenge type',
                        buttons: ChallengeTypes.asButtons({ method: 'challengeSelected' }).filter(
                            (button) => context.event.challengeType !== button.arg
                        )
                    },
                    source: this
                });
            }
        });
    }

    isValidCharacter(card) {
        return (
            card.getType() === 'character' &&
            card.isParticipating() &&
            (card.hasTrait('Direwolf') ||
                card.attachments.some((attachment) => attachment.hasTrait('Direwolf')))
        );
    }

    challengeSelected(player, challenge) {
        this.game.addMessage('{0} applies {1} claim instead', player, challenge);

        this.context.replaceHandler((event) => {
            event.claim.challengeType = challenge;

            this.game.queueStep(new SatisfyClaim(this.game, event.claim));
        });

        return true;
    }
}

WolvesInTheHills.code = '26112';

export default WolvesInTheHills;
