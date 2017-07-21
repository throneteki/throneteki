const _ = require('underscore');

const BaseStep = require('../basestep.js');

class FulfillMilitaryClaim extends BaseStep {
    constructor(game, player, claim) {
        super(game);
        this.player = player;
        this.claim = claim;
        this.forcedClaim = [];
    }

    continue() {
        this.forcedClaim = _.filter(this.player.mustChooseAsClaim, card => card.controller === this.player && card.location === 'play area');
        
        let claimToSelect = this.claim;
        
        if(this.forcedClaim.length >= 1 && this.forcedClaim.length < this.claim) {
            claimToSelect = this.claim - this.forcedClaim.length;
            this.game.addMessage('{0} {1} automatically chosen for claim',
                this.forcedClaim, this.forcedClaim.length > 1 ? 'are' : 'is');
        }

        let promptMessage = 'Select ' + claimToSelect + ' ' + (claimToSelect > 1 ? 'characters' : 'character') + ' to fulfill military claim';
        this.game.promptForSelect(this.player, {
            numCards: claimToSelect,
            activePromptTitle: promptMessage,
            waitingPromptTitle: 'Waiting for opponent to fulfill military claim',
            cardCondition: card =>
                card.location === 'play area'
                && card.controller === this.player
                && card.getType() === 'character'
                && this.mustChooseAsClaim(card),
            gameAction: 'kill',
            onSelect: (p, cards) => this.fulfillClaim(p, cards),
            onCancel: () => this.cancelClaim()
        });

        return true;
    }

    mustChooseAsClaim(card) {
        if(_.isEmpty(this.forcedClaim)) {
            return true;
        }

        if(this.forcedClaim.length < this.claim) {
            return !this.forcedClaim.includes(card);
        }

        return this.forcedClaim.includes(card);
    }

    fulfillClaim(p, cards) {
        if(!_.isArray(cards)) {
            cards = [cards];
        }

        if(this.forcedClaim.length < this.claim) {
            cards = cards.concat(this.forcedClaim);
        }

        var charactersAvailable = this.player.getNumberOfCardsInPlay(c => c.getType() === 'character');
        var maxAppliedClaim = Math.min(this.claim, charactersAvailable);

        if(cards.length < maxAppliedClaim) {
            return false;
        }

        this.game.addMessage('{0} chooses {1} for claim', this.player, cards);

        this.game.killCharacters(cards);

        return true;
    }

    cancelClaim() {
        this.game.addMessage('{0} has cancelled claim effects', this.player);
    }
}

module.exports = FulfillMilitaryClaim;
