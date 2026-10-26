import cards from './cards/index.js';
import ManualModePrompt from './gamesteps/ManualModePrompt.js';

/**
 * Whether players can use manual actions: chat commands that change the game, dragging cards,
 * clicking cards to kneel or stand them, changing stats. A game starts with manual mode off when
 * every card in every deck is verified (see docs/engine.md); turning it on then needs every opponent to
 * agree.
 */
class ManualMode {
    static isVerified(cardData) {
        return !!cards[cardData.code] || !(cardData.text || '').trim();
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

        this.enabled = !this.game
            .getPlayers()
            .every((player) =>
                player.preparedDeck.allCards.every((card) => this.isVerifiedCard(card))
            );

        if (!this.enabled) {
            this.game.addAlert(
                'info',
                'Every card in this game is verified, so manual mode is off'
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
        if (this.game.isGameOver) {
            this.toggle(player);
            return;
        }

        const opponents = this.game.getPlayers().filter((other) => other !== player);
        if (opponents.length === 0) {
            this.toggle(player);
            return;
        }

        this.game.addAlert(
            'info',
            '{0} asks to turn manual mode {1}',
            player,
            this.enabled ? 'off' : 'on'
        );
        this.game.queueStep(
            new ManualModePrompt(this.game, player, this.enabled ? 'off' : 'on', () =>
                this.toggle(player)
            )
        );
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
