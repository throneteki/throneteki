const DrawCard = require('../../drawcard.js');
const DiscardToReservePrompt = require('../../gamesteps/taxation/DiscardToReservePrompt');

class HothoHumpback extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            phase: 'challenge',
            limit: ability.limit.perRound(1),
            handler: () => {
                this.game.addMessage('{0} uses {1} to have each player draw a card and check for reserve', this.controller, this);
                for(let player of this.game.getPlayers()) {
                    if(player.canDraw()) {
                        player.drawCardsToHand(1);
                    }
                }
                let discardToReservePrompt = new DiscardToReservePrompt(this.game);
                discardToReservePrompt.continue();
            }
        });
    }
}

HothoHumpback.code = '15027';

module.exports = HothoHumpback;
