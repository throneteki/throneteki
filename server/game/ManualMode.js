import cards from './cards/index.js';
import ManualModePrompt from './gamesteps/ManualModePrompt.js';
import { needsImplementation } from './needsImplementation.js';

/**
 * Whether players can use manual actions: chat commands that change the game, dragging cards,
 * clicking cards to kneel or stand them, changing stats. A game starts with manual mode off when
 * every card in every deck is verified (see docs/engine.md); turning it on then needs every opponent to
 * agree, and turning it off does not.
 */
class ManualMode {
    static isVerified(cardData) {
        return !!cards[cardData.code] || !needsImplementation(cardData);
    }

    constructor(game, setting = 'auto') {
        this.game = game;
        this.setting = setting;
        this.enabled = setting !== false;
    }

    decideAtStart() {
        if (this.setting !== 'auto') {
            return;
        }

        const unverified = new Map();
        for (const player of this.game.getPlayers()) {
            for (const card of player.preparedDeck.allCards) {
                if (!this.isVerifiedCard(card) && !unverified.has(card.cardData.code)) {
                    unverified.set(card.cardData.code, card);
                }
            }
        }

        this.enabled = unverified.size > 0;

        if (this.enabled) {
            this.game.addAlert(
                'info',
                'Manual mode is on because these cards are not verified: {0}',
                [...unverified.values()]
            );
        } else {
            this.game.addAlert(
                'info',
                'Rules enforcement is on: the game applies the rules and cards for you. If something goes wrong, the Manual Mode button asks your opponent to allow manual changes, and Report Problem lets us know'
            );
        }
    }

    isVerifiedCard(card) {
        return ManualMode.isVerified(card.cardData || {});
    }

    allows() {
        return this.enabled;
    }

    request(player) {
        if (this.enabled || this.game.isGameOver) {
            this.toggle(player);
            return;
        }

        if (this.pendingRequest && !this.pendingRequest.isComplete()) {
            return;
        }

        const opponents = this.game.getPlayers().filter((other) => other !== player);
        if (opponents.length === 0) {
            this.toggle(player);
            return;
        }

        this.game.addAlert('info', '{0} asks to turn manual mode on', player);
        this.pendingRequest = new ManualModePrompt(this.game, player, () => this.toggle(player));
        this.game.queueStep(this.pendingRequest);
    }

    toggle(player) {
        this.enabled = !this.enabled;
        this.game.addAlert('danger', 'Manual mode is now {0}', this.enabled ? 'on' : 'off');

        this.game.manualActions.record(
            player,
            this.enabled ? 'manualModeEnabled' : 'manualModeDisabled'
        );
    }
}

export default ManualMode;
