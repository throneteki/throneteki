const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const KeepOrMulliganPrompt = require('./setup/keepormulliganprompt.js');
const SetupCardsPrompt = require('./setup/setupcardsprompt.js');
const CheckAttachmentsPrompt = require('./setup/checkattachmentsprompt.js');
const RookerySetupPrompt = require('./setup/RookerySetupPrompt');
const TextHelper = require('../TextHelper');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new SimpleStep(game, () => this.announceFactionAndAgenda()),
            new SimpleStep(game, () => this.promptForRookery()),
            new SimpleStep(game, () => this.prepareDecks()),
            new SimpleStep(game, () => this.turnOnEffects()),
            new SimpleStep(game, () => this.drawSetupHand()),
            new KeepOrMulliganPrompt(game),
            new SimpleStep(game, () => this.startGame()),
            new SetupCardsPrompt(game),
            new SimpleStep(game, () => this.announceSetupCards()),
            new SimpleStep(game, () => this.setupDone()),
            new CheckAttachmentsPrompt(game),
            new SimpleStep(game, () => game.activatePersistentEffects())
        ]);
    }

    announceFactionAndAgenda() {
        for(const player of this.game.getPlayers()) {
            player.createFactionAndAgenda();
            this.game.addMessage('{0} announces they are playing as {1} with {2}', player, player.faction, player.agenda || 'no agenda');
        }
    }

    promptForRookery() {
        if(this.game.useRookery) {
            this.game.queueStep(new RookerySetupPrompt(this.game));
        }
    }

    prepareDecks() {
        for(const player of this.game.getPlayers()) {
            player.prepareDecks();
        }
        this.game.gatherAllCards();
        this.game.raiseEvent('onDecksPrepared');
    }

    turnOnEffects() {
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

    announceSetupCards() {
        for(const player of this.game.getPlayers()) {
            let cardsInShadow = player.shadows.length;
            let cards = [...player.cardsInPlay];

            if(cardsInShadow > 0) {
                cards.push(`${TextHelper.count(cardsInShadow, 'card')} into shadows`);
            }

            if(cards.length === 0) {
                this.game.addMessage('{0} does not set up any cards', player);
            } else {
                this.game.addMessage('{0} sets up {1}', player, cards);
            }
        }
    }

    setupDone() {
        for(const player of this.game.getPlayers()) {
            player.setupDone();
        }
    }
}

module.exports = SetupPhase;
