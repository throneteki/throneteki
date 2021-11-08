const BaseStep = require('../basestep.js');
const AssaultKeywordAction = require('../../GameActions/AssaultkeywordAction.js');

class ChooseAssaultTargets extends BaseStep {
    constructor(game, challenge, assaultCharacters) {
        super(game);
        this.challenge = challenge;
        this.assaultCharacters = assaultCharacters.filter(character => this.hasAssaultTargets(character));
        this.assaultTargetChosen = false;
    }

    hasAssaultTargets(character) {
        return this.challenge.defendingPlayer.anyCardsInPlay(card => this.canAssault(card, this.challenge, character));
    }

    continue() {
        //as soon as one assault target has been chosen, stop asking for targets even when multiple assault characters are in the challenge
        if(this.assaultCharacters.length > 0 && !this.assaultTargetChosen) {
            let highestPrintedCost = this.assaultCharacters.map(character => character.getPrintedCost()).reduce((highestPrintedCost, printedCost) => {
                if(printedCost > highestPrintedCost) {
                    highestPrintedCost = printedCost;
                }
                return highestPrintedCost;
            }, 0);
            let characterWithHighestPrintedCost = this.assaultCharacters.filter(character => character.getPrintedCost() === highestPrintedCost)[0];

            let title = 'Select assault target for ' + characterWithHighestPrintedCost.name;
            this.game.promptForSelect(characterWithHighestPrintedCost.controller, {
                numCards: 1,
                activePromptTitle: title,
                waitingPromptTitle: 'Waiting for opponent to choose assault target for ' + characterWithHighestPrintedCost.name,
                cardCondition: card => this.canAssault(card, this.challenge, characterWithHighestPrintedCost),
                onSelect: (player, target) => this.selectAssaultTarget(characterWithHighestPrintedCost, target)
            });
        }

        //always return true as no more than one assault target can be chosen
        return true;
    }

    canAssault(card, challenge, character) {
        return AssaultKeywordAction.allow({ challenge, source: character, target: card });
    }

    selectAssaultTarget(character, targets) {
        if(!Array.isArray(targets)) {
            targets = [targets];
        }

        for(let target of targets) {
            this.challenge.addAssaultChoice(character, target);
        }

        this.game.addMessage('{0} has chosen {1} as the assault target for {2} and blanks it until the end of the challenge', this.challenge.attackingPlayer, targets, character);

        this.assaultTargetChosen = true;

        return true;
    }
}

module.exports = ChooseAssaultTargets;
