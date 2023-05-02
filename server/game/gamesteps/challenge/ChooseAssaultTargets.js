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
            let highestPrintedCost = Math.max(...this.assaultCharacters.map(character => character.getPrintedCost()));
            let characterWithHighestPrintedCost = this.assaultCharacters.find(character => character.getPrintedCost() === highestPrintedCost);
            // Keyword modifier adjusts the number of locations that can be targeted using assault
            let numTargets = 1 + characterWithHighestPrintedCost.getKeywordTriggerModifier('assault');
            let title = `Select ${numTargets === 1 ? 'assault target' : `up to ${numTargets} assault targets`} for ${characterWithHighestPrintedCost.name}`;
            this.game.promptForSelect(characterWithHighestPrintedCost.controller, {
                numCards: numTargets,
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

        this.game.addMessage(`{0} has chosen {1} as the assault ${targets.length > 1 ? 'targets' : 'target' } for {2} and blanks ${targets.length > 1 ? 'them' : 'it' } until the end of the challenge`, this.challenge.attackingPlayer, targets, character);

        this.assaultTargetChosen = true;

        return true;
    }
}

module.exports = ChooseAssaultTargets;
