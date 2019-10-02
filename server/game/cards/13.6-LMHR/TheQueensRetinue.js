const DrawCard = require('../../drawcard');

class TheQueensRetinue extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put into play',
            location: 'shadows',
            handler: context => {
                context.player.putIntoPlay(this);
                if(this.location === 'play area') {
                    for(let opponent of this.game.getOpponents(this.controller)) {
                        if(opponent.canDraw()) {
                            opponent.drawCardsToHand(2);
                        }
                    }
                    this.game.addMessage('{0} uses {1} to put {1} into play from shadows and have each opponent draw 2 cards', this.controller, this);
                }
            }
        });
    }
}

TheQueensRetinue.code = '13103';

module.exports = TheQueensRetinue;

