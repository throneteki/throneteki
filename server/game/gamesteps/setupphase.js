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
        for(const player of this.game.getPlayers()) {
            if(player.agenda) {
                player.agenda.applyPersistentEffects();
            }
        }

        for(const card of this.game.allCards) {
            card.applyAnyLocationPersistentEffects();
        }
    }

    drawSetupHand() {
        for(const player of this.game.getPlayers()) {
            player.drawSetupHand();
        }
    }

    startGame() {
        for(const player of this.game.getPlayers()) {
            player.startGame();
        }
    }

    setupDone() {
        for(const player of this.game.getPlayers()) {
            player.setupDone();
        }
    }
}

module.exports = SetupPhase;
