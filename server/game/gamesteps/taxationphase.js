const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const DiscardToReservePrompt = require('./taxation/discardtoreserveprompt.js');
const EndRoundPrompt = require('./taxation/endroundprompt.js');

class TaxationPhase extends Phase {
    constructor(game) {
        super(game, 'taxation');
        this.initialise([
            new SimpleStep(game, () => this.returnGold()),
            new DiscardToReservePrompt(game),
            new EndRoundPrompt(game),
            new SimpleStep(game, () => this.roundEnded())
        ]);
    }

    returnGold() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            this.game.raiseMergedEvent('onUnspentGoldReturned', { player: player }, () => {
                player.taxation();
            });
        });
    }

    roundEnded() {
        this.game.raiseMergedEvent('onRoundEnded');
    }
}

module.exports = TaxationPhase;
