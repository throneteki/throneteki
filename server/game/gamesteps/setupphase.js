const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const KeepOrMulliganPrompt = require('./setup/keepormulliganprompt.js');
const SetupCardsPrompt = require('./setup/setupcardsprompt.js');
const CheckAttachmentsPrompt = require('./setup/checkattachmentsprompt.js');
const RookerySetupPrompt = require('./setup/RookerySetupPrompt');
const TextHelper = require('../TextHelper');
const { StartingHandSize } = require('../Constants');

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
        for(const card of this.game.allCards) {
            card.applyAnyLocationPersistentEffects();

            if(card.getType() === 'agenda') {
                card.applyPersistentEffects();
            }
        }
    }

    drawSetupHand() {
        for(const player of this.game.getPlayers()) {
            player.drawCardsToHand(StartingHandSize);
        }
    }

    startGame() {
        for(const player of this.game.getPlayers()) {
            player.readyToStart = true;
            this.game.addGold(player, player.setupGold);
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
            // Draw back up to starting hand size
            if(player.hand.length < StartingHandSize) {
                player.drawCardsToHand(StartingHandSize - player.hand.length);
            }

            this.game.returnGoldToTreasury({ player: player, amount: player.gold });
            player.revealSetupCards();
        }
    }
}

module.exports = SetupPhase;
