const PlotCard = require('../../plotcard.js');

class NothingBurnsLikeTheCold extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.selections = [];
                this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
                this.proceedToNextStep();
            }
        });
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            let currentPlayer = this.remainingPlayers.shift();
            this.promptForAttachment(currentPlayer);
        } else {
            this.doDiscard();
        }
    }

    promptForAttachment(currentPlayer) {
        if(!this.hasValidAttachments(currentPlayer)) {
            this.onSelectAttachment(currentPlayer, null);
            return;
        }

        this.game.promptForSelect(currentPlayer, {
            activePromptTitle: 'Select an attachment',
            source: this,
            cardCondition: card => card.location === 'play area' && card.controller === currentPlayer && card.getType() === 'attachment',
            gameAction: 'discard',
            onSelect: (player, card) => this.onSelectAttachment(player, card),
            onCancel: (player) => this.onSelectAttachment(player, null)
        });
    }

    hasValidAttachments(player) {
        return this.game.anyCardsInPlay(card => card.controller === player && card.getType() === 'attachment');
    }

    onSelectAttachment(currentPlayer, attachment) {
        this.promptForLocation(currentPlayer, attachment);
        return true;
    }

    promptForLocation(currentPlayer, attachment) {
        if(!this.hasValidLocations(currentPlayer)) {
            this.onSelectLocation(currentPlayer, attachment, null);
            return;
        }

        this.game.promptForSelect(currentPlayer, {
            activePromptTitle: 'Select a location',
            source: this,
            cardCondition: card => card.location === 'play area' && card.controller === currentPlayer && card.getType() === 'location' && !card.isLimited(),
            gameAction: 'discard',
            onSelect: (player, card) => this.onSelectLocation(player, attachment, card),
            onCancel: (player) => this.onSelectLocation(player, attachment, null)
        });
    }

    hasValidLocations(player) {
        return this.game.anyCardsInPlay(card => card.controller === player && card.getType() === 'location' && !card.isLimited() && card.canBeDiscarded());
    }

    onSelectLocation(player, attachment, location) {
        let cards = [attachment, location].filter(card => card !== null);

        if(cards.length === 0) {
            this.game.addMessage('{0} does not choose any cards for {1}', player, this);
        } else {
            this.game.addMessage('{0} chooses {1} for {2}', player, cards, this);
        }

        if(!attachment && this.hasValidAttachments(player)) {
            this.game.addAlert('danger', '{0} has attachments for {1} but did not select one', player, this);
        }

        if(!location && this.hasValidLocations(player)) {
            this.game.addAlert('danger', '{0} has locations for {1} but did not select one', player, this);
        }

        this.selections.push({ player: player, cards: cards });
        this.proceedToNextStep();
        return true;
    }

    doDiscard() {
        for(let selection of this.selections) {
            let player = selection.player;

            if(selection.cards.length !== 0) {
                this.game.addMessage('{0} discards {1} for {2}', player, selection.cards, this);
                player.discardCards(selection.cards, false);
            }
        }

        this.selections = [];
    }
}

NothingBurnsLikeTheCold.code = '09052';

module.exports = NothingBurnsLikeTheCold;
