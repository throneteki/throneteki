const PlotCard = require('../../plotcard.js');

class SummonedToCourt extends PlotCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: event => event.phase === 'draw'
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                activePromptTitle: 'Choose a card to reveal',
                cardCondition: (card, context) => card.controller === context.choosingPlayer && card.location === 'hand',
                message: '{targetSelection.choosingPlayer} chooses a card in hand to reveal for {source}'
            },
            handler: context => {
                let selections = context.targets.selections.filter(selection => !!selection.value);
                this.revealPlayerChoices(selections);
                this.validChoices = this.getLowestCostChoices(selections);
                this.promptNextPlayerToPutIntoPlay();
            }
        });
    }

    revealPlayerChoices(selections) {
        for(let selection of selections) {
            this.game.addMessage('{0} reveals {1} as their choice for {2}', selection.choosingPlayer, selection.value, this);
        }
    }

    getLowestCostChoices(selections) {
        let characterChoices = selections.filter(selection => selection.value.getType() === 'character');
        let costs = characterChoices.map(selection => selection.value.getPrintedCost());
        let minCost = Math.min(...costs);
        return selections.filter(selection => selection.value.getPrintedCost() === minCost);
    }

    promptNextPlayerToPutIntoPlay() {
        if(this.validChoices.length === 0) {
            return;
        }

        let choice = this.validChoices.shift();
        this.promptPlayerToPutIntoPlay(choice.choosingPlayer, choice.value);
    }

    promptPlayerToPutIntoPlay(player, card) {
        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Put ' + card.name + ' into play?',
                buttons: [
                    { text: 'Yes', method: 'putChoiceIntoPlay', card: card, mapCard: true },
                    { text: 'No', method: 'declinePutIntoPlay', card: card, mapCard: true }
                ]
            },
            source: this
        });
    }

    putChoiceIntoPlay(player, card) {
        player.putIntoPlay(card);
        this.game.addMessage('{0} chooses to put {1} into play using {2}', player, card, this);
        this.promptNextPlayerToPutIntoPlay();
        return true;
    }

    declinePutIntoPlay(player, card) {
        this.game.addMessage('{0} declines to put {1} into play using {2}', player, card, this);
        this.promptNextPlayerToPutIntoPlay();
        return true;
    }
}

SummonedToCourt.code = '05048';

module.exports = SummonedToCourt;
