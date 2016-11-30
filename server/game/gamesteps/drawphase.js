const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');

class DrawPhase extends Phase {
    constructor(game) {
        super(game);
        this.initialise([
            new SimpleStep(game, () => this.draw()),
            // Temporarily start marshal phase.
            new SimpleStep(game, () => this.game.beginMarshal(this.game.getFirstPlayer()))
        ]);
    }

    draw() {
        _.each(this.game.getPlayers(), p => {
            this.game.emit('beginDrawPhase', this, p);
            p.drawPhase();
        });
    }
}

module.exports = DrawPhase;
