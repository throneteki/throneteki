const DrawCard = require('../../drawcard.js');
const { Tokens } = require('../../Constants');

class StannissCavalry extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'standing',
            targetController: 'opponent',
            match: (card) =>
                card.getType() === 'character' &&
                card.getPrintedCost() === this.tokens[Tokens.gold],
            effect: ability.effects.cannotBeStood()
        });

        this.action({
            title: 'Move gold to ' + this.name,
            condition: () => this.controller.getSpendableGold() >= 1,
            phase: 'standing',
            limit: ability.limit.perPhase(2),
            handler: (context) => {
                this.game.transferGold({ from: this.controller, to: this, amount: 1 });
                this.game.addMessage(
                    '{0} moves 1 gold from their gold pool to {1}',
                    context.player,
                    this
                );
            }
        });
    }
}

StannissCavalry.code = '06087';

module.exports = StannissCavalry;
