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
        for(const p of this.game.getPlayers()) {
            p.drawPhase();
        }
    }
}

module.exports = DrawPhase;
