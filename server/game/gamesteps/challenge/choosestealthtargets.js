const BaseStep = require('../basestep.js');
const SimpleStep = require('../simplestep.js');

class ChooseStealthTargets extends BaseStep {
    constructor(game, attackingPlayer, defendingPlayer, stealthCharacters) {
        super(game);
        this.attackingPlayer = attackingPlayer;
        this.defendingPlayer = defendingPlayer;
        this.stealthCharacters = stealthCharacters;
    }

    continue() {
        var character = this.stealthCharacters.shift();
        this.game.promptForSelect(character.owner, {
            activePromptTitle: 'Select stealth target for ' + character.name,
            waitingPromptTitle: 'Waiting for opponent to choose stealth target for '  + character.name,
            cardCondition: card => card.owner === this.defendingPlayer && card.getType() === 'character',
            onSelect: (player, target) => this.selectStealthTarget(character, target)
        });

        // TODO: Temporarily re-enter old game flow
        if(this.stealthCharacters.length === 0) {
            this.game.queueStep(new SimpleStep(this.game, () => {
                this.game.completeAttacker(this.attackingPlayer);
            }));
        }
        return this.stealthCharacters.length === 0;
    }

    selectStealthTarget(character, target) {
        if(!character.useStealthToBypass(target)) {
            return false;
        }

        this.game.addMessage('{0} has chosen {1} as the stealth target for {2}', this.attackingPlayer, target, character);

        return true;
    }
}

module.exports = ChooseStealthTargets;
