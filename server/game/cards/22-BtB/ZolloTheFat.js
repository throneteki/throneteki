const DrawCard = require('../../drawcard.js');

class ZolloTheFat extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onGoldGained: event => event.player !== this.controller && this.game.currentPhase !== 'marshal' && this.controller.canGainGold()
            },
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                this.game.transferGold({ from: context.event.player, to: this.controller, amount: context.event.player.gold });
                this.game.addMessage('{0} sacrifices {1} to move {2} gold from {3}\'s gold pool to their own', context.player, this, context.event.player.gold, context.event.player);
            }
        });
    }
}

ZolloTheFat.code = '22025';

module.exports = ZolloTheFat;
