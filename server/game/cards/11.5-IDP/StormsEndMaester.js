const DrawCard = require('../../drawcard.js');

class StormsEndMaester extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw cards',
            phase: 'challenge',
            condition: () => this.controller.canDraw(),
            cost: ability.costs.kneelSelf(),
            chooseOpponent: opponent => this.controller.faction.power > opponent.faction.power,
            handler: context => {
                let numDrawn = context.player.drawCardsToHand(2).length;
                this.game.addMessage('{0} kneels {1} to draw {2} {3}',
                    context.player, this, numDrawn, numDrawn > 1 ? 'cards' : 'card');
            }
        });
    }
}

StormsEndMaester.code = '11087';

module.exports = StormsEndMaester;
