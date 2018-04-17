const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const KeepOrMulliganPrompt = require('./setup/keepormulliganprompt.js');
const SetupCardsPrompt = require('./setup/setupcardsprompt.js');
const CheckAttachmentsPrompt = require('./setup/checkattachmentsprompt.js');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new SimpleStep(game, () => this.prepareDecks()),
            new SimpleStep(game, () => this.drawSetupHand()),
            new KeepOrMulliganPrompt(game),
            new SimpleStep(game, () => this.startGame()),
            new SetupCardsPrompt(game),
            new SimpleStep(game, () => this.setupDone()),
            new CheckAttachmentsPrompt(game),
            new SimpleStep(game, () => game.activatePersistentEffects())
        ]);
    }

    prepareDecks() {
        this.game.raiseEvent('onDecksPrepared');
        _.each(this.game.getPlayers(), player => {
            if(player.agenda) {
                player.agenda.applyPersistentEffects();
            }
        });
        for(const card of this.game.allCard) {
            card.applyAnyLocationPersistentEffects();
        }
    }

    drawSetupHand() {
        _.each(this.game.getPlayers(), player => {
            player.drawSetupHand();
        });
    }

    startGame() {
        _.each(this.game.getPlayers(), player => {
            player.startGame();
        });
    }

    setupDone() {
        _.each(this.game.getPlayers(), p => {
            p.setupDone();
        });
    }
}

module.exports = SetupPhase;
