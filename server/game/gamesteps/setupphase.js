import sample from 'lodash.sample';
import Phase from './phase.js';
import SimpleStep from './simplestep.js';
import ChooseResolutionOrder from './ChooseResolutionOrder.js';
import KeepOrMulliganPrompt from './setup/keepormulliganprompt.js';
import SetupCardsPrompt from './setup/setupcardsprompt.js';
import CheckAttachmentsPrompt from './setup/checkattachmentsprompt.js';
import RevealSetupCards from '../GameActions/RevealSetupCards.js';
import FinishSetup from '../GameActions/FinishSetup.js';
import { StartingHandSize } from '../Constants/index.js';

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new SimpleStep(game, () => this.randomFirstPlayer()),
            new SimpleStep(game, () => this.announceFactionAndAgenda()),
            new SimpleStep(game, () => this.prepareDecks()),
            new SimpleStep(game, () => this.turnOnEffects()),
            new SimpleStep(game, () => this.resolveAgendaSetupAbilities()),
            new SimpleStep(game, () => this.drawSetupHand()),
            new KeepOrMulliganPrompt(game),
            new SimpleStep(game, () => this.startGame()),
            new SetupCardsPrompt(game),
            new SimpleStep(game, () => this.announceSetupCards()),
            new SimpleStep(game, () => this.setupDone()),
            new CheckAttachmentsPrompt(game),
            new SimpleStep(game, () => game.activatePersistentEffects())
        ]);
        this.sampleFunc = sample;
    }

    announceFactionAndAgenda() {
        for (const player of this.game.getPlayersInFirstPlayerOrder()) {
            player.createFactionAndAgendas();
            this.game.addMessage(
                '{0} announces they are playing as {1} with {2}',
                player,
                player.faction,
                player.agendas || 'no agenda'
            );
        }
    }

    prepareDecks() {
        for (const player of this.game.getPlayers()) {
            player.prepareDecks();
        }
        this.game.gatherAllCards();
        this.game.manualMode.decideAtStart();
        this.game.raiseEvent('onDecksPrepared');
    }

    randomFirstPlayer() {
        const firstPlayer = this.sampleFunc(this.game.getPlayers());
        this.game.addMessage('{0} has been randomly selected to be first player', firstPlayer);
        this.game.setFirstPlayer(firstPlayer);
    }

    turnOnEffects() {
        for (const card of this.game.allCards) {
            card.applyAnyLocationPersistentEffects();

            if (card.getType() === 'agenda') {
                card.applyPersistentEffects();
            }
        }
    }

    resolveAgendaSetupAbilities() {
        const abilities = this.game
            .getPlayers()
            .flatMap((player) => player.agendas || [])
            .flatMap((agenda) => agenda.abilities.agendaSetup);

        this.game.queueStep(
            new ChooseResolutionOrder(
                this.game,
                abilities.map((ability) => ({
                    player: ability.card.controller,
                    source: ability.card,
                    canResolve: () => ability.canResolve(ability.createContext()),
                    resolve: () => this.game.resolveAbility(ability, ability.createContext())
                }))
            )
        );
    }

    drawSetupHand() {
        for (const player of this.game.getPlayers()) {
            player.drawCardsToHand(StartingHandSize);
        }
    }

    startGame() {
        for (const player of this.game.getPlayers()) {
            player.readyToStart = true;
            this.game.addGold(player, player.setupGold);
        }
    }

    announceSetupCards() {
        this.game.resolveGameAction(RevealSetupCards, { game: this.game });
    }

    setupDone() {
        for (const player of this.game.getPlayers()) {
            // Draw back up to starting hand size
            if (player.hand.length < StartingHandSize) {
                player.drawCardsToHand(StartingHandSize - player.hand.length);
            }

            this.game.returnGoldToTreasury({ player: player, amount: player.gold });
        }
        this.game.resolveGameAction(FinishSetup, { game: this.game });
    }
}

export default SetupPhase;
