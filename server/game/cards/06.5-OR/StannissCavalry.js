const DrawCard = require('../../drawcard.js');

class StannissCavalry extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'standing',
            targetController: 'opponent',
            match: card => card.getType() === 'character' && card.getPrintedCost() === this.tokens['gold'],
            effect: ability.effects.cannotBeStood()
        });

        this.action({
            title: 'Move gold to ' + this.name,
            condition: () => this.controller.gold >= 1,
            phase: 'standing',
            limit: ability.limit.perPhase(2),
            handler: context => {
                this.game.addGold(this.controller, -1);
                this.modifyToken('gold', 1);
                this.game.addMessage('{0} moves 1 gold from their gold pool to {1}', context.player, this);
            }
        });
    }
}

StannissCavalry.code = '06087';

module.exports = StannissCavalry;
