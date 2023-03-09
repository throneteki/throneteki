const BaseStep = require('../basestep.js');
const BypassByStealth = require('../../GameActions/BypassByStealth');

class ChooseStealthTargets extends BaseStep {
    constructor(game, challenge, stealthCharacters) {
        super(game);
        this.challenge = challenge;
        this.stealthCharacters = stealthCharacters.filter(character => this.hasStealthTargets(character));
    }

    hasStealthTargets(character) {
        return this.challenge.defendingPlayer.anyCardsInPlay(card => this.canStealth(card, this.challenge, character));
    }

    continue() {
        if(this.stealthCharacters.length > 0) {
            let character = this.stealthCharacters.shift();
            // Keyword modifier adjusts the number of characters that can be bypassed using stealth
            let numTargets = 1 + character.getKeywordTriggerModifier('stealth');
            let title = `Select ${numTargets === 1 ? 'stealth target' : `up to ${numTargets} stealth targets`} for ${character.name}`;
            this.game.promptForSelect(character.controller, {
                numCards: numTargets,
                activePromptTitle: title,
                waitingPromptTitle: 'Waiting for opponent to choose stealth target for ' + character.name,
                cardCondition: card => this.canStealth(card, this.challenge, character),
                onSelect: (player, target) => this.selectStealthTarget(character, target)
            });
        }

        return this.stealthCharacters.length === 0;
    }

    canStealth(card, challenge, character) {
        return BypassByStealth.allow({ challenge, source: character, target: card });
    }

    selectStealthTarget(character, targets) {
        if(!Array.isArray(targets)) {
            targets = [targets];
        }

        for(let target of targets) {
            this.challenge.addStealthChoice(character, target);
        }
        
        this.game.addMessage(`{0} has chosen {1} as the stealth ${targets.length > 1 ? 'targets' : 'target' } for {2}`, this.challenge.attackingPlayer, targets, character);

        return true;
    }
}

module.exports = ChooseStealthTargets;
