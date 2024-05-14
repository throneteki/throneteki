const DrawCard = require('../../drawcard.js');
const { Tokens } = require('../../Constants');

class WexPyke extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            targetController: 'any',
            match: (card) =>
                card.getType() === 'character' &&
                card.getPrintedCost() === this.tokens[Tokens.gold],
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });

        this.action({
            title: 'Move gold to ' + this.name,
            condition: () => this.controller.getSpendableGold() >= 1,
            phase: 'dominance',
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

WexPyke.code = '06031';

module.exports = WexPyke;
