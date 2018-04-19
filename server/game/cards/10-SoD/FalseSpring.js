const _ = require('underscore');

const PlotCard = require('../../plotcard.js');

class FalseSpring extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.remainingOpponents = this.game.getPlayers().filter(player => player !== this.controller);
                this.selections = [];
                this.proceedToNextStep();
            }
        });
    }

    proceedToNextStep() {
        if(this.remainingOpponents.length > 0) {
            let currentOpponent = this.remainingOpponents.shift();
            let numToReveal = Math.min(currentOpponent.hand.length, 3);

            this.game.promptForSelect(currentOpponent, {
                activePromptTitle: `Select ${numToReveal} card(s)`,
                source: this,
                numCards: numToReveal,
                multiSelect: true,
                mode: 'exactly',
                cardCondition: card => card.location === 'hand' && card.controller === currentOpponent,
                onSelect: (player, cards) => this.onToRevealSelected(player, cards)
            });
        } else {
            this.doReveal();
        }
    }

    onToRevealSelected(player, cards) {
        this.selections = this.selections.concat(cards);
        this.game.addMessage('{0} reveals {1} for {2}', player, cards, this);
        this.proceedToNextStep();
        return true;
    }

    doReveal() {
        let numToDiscard = this.game.getNumberOfPlayers() - 1;

        //TODO Melee: This prompt should work in Melee with well-meaning players but can be abused as well
        this.game.promptForSelect(this.controller, {
            activePromptTitle: `Select up to ${numToDiscard} card(s)`,
            mode: 'upTo',
            source: this,
            revealTargets: true,
            multiSelect: true,
            numCards: numToDiscard,
            cardCondition: card => this.selections.includes(card),
            onSelect: (player, cards) => this.onToDiscardardSelected(player, cards)
        });
    }

    onToDiscardardSelected(player, cards) {
        _.each(cards, card => card.controller.discardCard(card));
        this.game.addMessage('{0} uses {1} to discard {2}', player, this, cards);
        return true;
    }
}

FalseSpring.code = '10052';

module.exports = FalseSpring;
