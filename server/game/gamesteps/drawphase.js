const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');

class DrawPhase extends Phase {
    constructor(game) {
        super(game, 'draw');
        this.initialise([
            new SimpleStep(game, () => this.draw()),
            new ActionWindow(this.game, 'After cards drawn', 'draw')
        ]);
    }

    draw() {
        for(let player of this.game.getPlayers()) {
            if(player.canDraw()) {
                let cards = player.drawCardsToHand(player.drawPhaseCards);
                this.game.addMessage('{0} draws {1} cards', player, cards.length);
            }
        }
    }
}

module.exports = DrawPhase;
