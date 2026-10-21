import GameActions from '../../GameActions/index.js';
import BaseStep from '../basestep.js';

class FulfillMilitaryClaim extends BaseStep {
    constructor(game, player, claim) {
        super(game);
        this.player = player;
        this.claim = claim;
        this.forcedClaim = [];
    }

    continue() {
        const killable = this.killableCharacters();

        if (killable.length === 0) {
            this.game.addMessage('{0} has no characters to fulfill military claim', this.player);
            return true;
        }

        this.forcedClaim = killable.filter((card) => this.player.mustChooseAsClaim.includes(card));

        if (this.forcedClaim.length >= this.claim) {
            this.promptForClaim(this.claim, (card) => this.forcedClaim.includes(card));
            return true;
        }

        if (this.forcedClaim.length > 0) {
            this.game.addMessage(
                '{0} {1} automatically chosen for claim',
                this.forcedClaim,
                this.forcedClaim.length > 1 ? 'are' : 'is'
            );
        }

        if (killable.length === this.forcedClaim.length) {
            this.fulfillClaim(this.player, []);
            return true;
        }

        const claimToSelect = this.claim - this.forcedClaim.length;

        this.promptForClaim(claimToSelect, (card) => !this.forcedClaim.includes(card));

        return true;
    }

    promptForClaim(numCards, cardCondition) {
        this.game.promptForSelect(this.player, {
            numCards,
            activePromptTitle: `Select ${numCards} ${numCards > 1 ? 'characters' : 'character'} to fulfill military claim`,
            waitingPromptTitle: 'Waiting for opponent to fulfill military claim',
            cardCondition: (card) =>
                card.location === 'play area' &&
                card.controller === this.player &&
                card.getType() === 'character' &&
                cardCondition(card),
            gameAction: 'kill',
            onSelect: (p, cards) => this.fulfillClaim(p, cards),
            onCancel: () => this.cancelClaim(),
            canCancel: this.game.manualMode.enabled
        });
    }

    killableCharacters() {
        return this.player.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.allowGameAction('kill')
        );
    }

    fulfillClaim(p, cards) {
        if (!Array.isArray(cards)) {
            cards = [cards];
        }

        if (this.forcedClaim.length < this.claim) {
            cards = cards.concat(this.forcedClaim);
        }

        var maxAppliedClaim = Math.min(this.claim, this.killableCharacters().length);

        if (cards.length < maxAppliedClaim) {
            return false;
        }

        this.game.addMessage('{0} chooses {1} for claim', this.player, cards);

        this.game.resolveGameAction(
            GameActions.simultaneously(
                cards.map((card) => GameActions.kill({ card, allowSave: true }))
            )
        );

        return true;
    }

    cancelClaim() {
        this.game.addMessage('{0} has cancelled claim effects', this.player);
    }
}

export default FulfillMilitaryClaim;
