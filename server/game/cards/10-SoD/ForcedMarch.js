const _ = require('underscore');

const PlotCard = require('../../plotcard.js');

class ForcedMarch extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.initiate();
            }
        });
    }

    initiate() {
        this.remainingOpponents = this.filterForOpponents();
        this.selections = [];
        this.proceedToNextStep();
    }

    proceedToNextStep() {
        if(this.remainingOpponents.length > 0) {
            let currentOpponent = this.remainingOpponents.shift();

            this.game.promptForSelect(currentOpponent, {
                source: this,
                gameAction: 'kneel',
                cardCondition: card => this.isStandingMilIcon(card) && card.controller === currentOpponent,
                onSelect: (player, card) => this.onToKneelSelected(player, card),
                onCancel: player => this.onToKneelCanceled(player)
            });
        } else {
            this.doKneel();
        }
    }

    onToKneelSelected(player, card) {
        this.selections.push(card);
        this.game.addMessage('{0} kneels {1} for {2}', player, card, this);
        this.proceedToNextStep();
        return true;
    }

    onToKneelCanceled(player) {
        this.game.addAlert('danger', '{0} did not choose a character with a {1} icon to kneel for {2}', player, 'military', this);
        this.proceedToNextStep();
        return true;
    }

    doKneel() {
        for(let card of this.selections) {
            card.controller.kneelCard(card);
        }

        if(this.hasStandingMilIcon(this.controller) && !_.isEmpty(this.filterForOpponents())) {
            this.game.promptForSelect(this.controller, {
                source: this,
                gameAction: 'kneel',
                cardCondition: card => this.isStandingMilIcon(card) && card.controller === this.controller,
                onSelect: (player, card) => this.onCostKneelSelected(player, card),
                onCancel: player => this.onCostKneelCancelled(player)
            });
        }
    }

    onCostKneelSelected(player, card) {
        player.kneelCard(card);
        this.game.addMessage('{0} then kneels {1} to initiate the effect of {2} again', player, card, this);
        this.initiate();
        return true;
    }

    onCostKneelCancelled() {
        return true;
    }

    filterForOpponents() {
        return this.game.getPlayers().filter(player => player !== this.controller &&
                                                          this.hasStandingMilIcon(player));

    }

    hasStandingMilIcon(player) {
        return player.anyCardsInPlay(card => this.isStandingMilIcon(card));
    }

    isStandingMilIcon(card) {
        return card.location === 'play area' && card.hasIcon('military') && !card.kneeled && card.canBeKneeled();
    }
}

ForcedMarch.code = '10048';

module.exports = ForcedMarch;
