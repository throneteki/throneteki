import BaseStep from '../basestep.js';
import FulfillMilitaryClaim from './fulfillmilitaryclaim.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';
import DiscardCard from '../../GameActions/DiscardCard.js';

class SatisfyClaim extends BaseStep {
    // Claim's kills, discards and power moves are attached to the claim event, so that reactions to
    // them share a window with reactions to claim being applied.
    constructor(game, claim, event) {
        super(game);
        this.claim = claim;
        this.event = event;
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

        this.event.thenExecute(() => {
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
                    new FulfillMilitaryClaim(
                        this.game,
                        claimRecipient,
                        this.claim.value,
                        this.event
                    )
                );
                break;
            case 'intrigue':
                this.game.addMessage(
                    '{0} claim is applied.  {1} must discard {2} at random',
                    this.claim.challengeType,
                    claimRecipient,
                    TextHelper.count(this.claim.value, 'card')
                );
                this.attachGameAction(
                    GameActions.discardAtRandom({
                        amount: this.claim.value,
                        player: claimRecipient,
                        discardEvent: (card) =>
                            DiscardCard.createEvent({ card, allowSave: false, isClaim: true })
                    })
                );
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
                this.attachGameAction(
                    GameActions.movePower({
                        from: claimRecipient.faction,
                        to: this.claim.winner.faction,
                        amount: this.claim.value
                    })
                );
                break;
            }
        }
    }

    attachGameAction(gameAction) {
        if (gameAction.allow()) {
            this.event.thenAttachEvent(gameAction.createEvent());
        }
    }
}

export default SatisfyClaim;
