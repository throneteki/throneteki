const DrawCard = require('../../drawcard.js');
const { Tokens } = require('../../Constants');

class RedCloaks extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move 1 gold from your gold pool to this card',
            limit: ability.limit.perPhase(1),
            condition: () => this.controller.getSpendableGold() >= 1,
            handler: () => {
                this.game.transferGold({ from: this.controller, to: this, amount: 1 });
                this.game.addMessage(
                    '{0} moves 1 gold from their gold pool to {1}',
                    this.controller,
                    this
                );
            }
        });
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ challengeType: 'intrigue' }),
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens[Tokens.gold])
        });
    }
}

RedCloaks.code = '02070';

module.exports = RedCloaks;
