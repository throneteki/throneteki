const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const DiscardToReservePrompt = require('./taxation/discardtoreserveprompt.js');
const ActionWindow = require('./actionwindow.js');

class TaxationPhase extends Phase {
    constructor(game) {
        super(game, 'taxation');
        this.initialise([
            new SimpleStep(game, () => this.returnGold()),
            new DiscardToReservePrompt(game),
            new SimpleStep(game, () => this.returnTitleCards()),
            new ActionWindow(game, 'After reserve check', 'taxation'),
            new SimpleStep(game, () => this.roundEnded())
        ]);
    }

    returnGold() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            if(!player.doesNotReturnUnspentGold) {
                player.taxation();
            }
        });
    }

    returnTitleCards() {
        if(!this.game.isMelee) {
            return;
        }

        _.each(this.game.getPlayers(), player => {
            this.game.titlePool.returnToPool(player, player.title);
        });
    }

    roundEnded() {
        this.game.raiseEvent('onRoundEnded');
    }
}

module.exports = TaxationPhase;
