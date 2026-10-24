import PlayerOrderPrompt from './playerorderprompt.js';

class ActionWindow extends PlayerOrderPrompt {
    constructor(game, title, windowName) {
        super(game);

        this.title = title;
        this.windowName = windowName;
        this.offer = null;
    }

    continue() {
        if (this.game.strictActionWindows) {
            this.offerToCurrentPlayer();
        }

        let completed = super.continue();

        if (!completed) {
            this.game.currentActionWindow = this;
        } else {
            this.game.currentActionWindow = null;
        }

        return completed;
    }

    offerToCurrentPlayer() {
        this.game.currentActionWindow = this;
        this.lazyFetchPlayers();

        while (!this.isComplete()) {
            const player = this.currentPlayer;
            if (this.offer && this.offer.player === player) {
                return;
            }

            const type = this.getOfferType(player);
            if (type === 'skip') {
                this.completePlayer();
                continue;
            }

            this.offer = { player, type };
            if (type === 'wait' || type === 'visible-wait') {
                this.passAfterDelay(this.offer);
            }
            return;
        }
    }

    getOfferType(player) {
        if (!player.isPlaying()) {
            return 'skip';
        }

        if (player.promptedActionWindows[this.windowName]) {
            return 'prompt';
        }

        if (this.hasAvailablePublicAction(player)) {
            return 'visible-wait';
        }

        if (this.hasAvailableAction(player)) {
            return 'prompt';
        }

        if (this.game.getPossibleResponders().couldAct(player)) {
            return 'wait';
        }

        return 'skip';
    }

    hasAvailableAction(player) {
        return this.game.allCards.some((card) => {
            try {
                return card.hasUsableAction(player);
            } catch (error) {
                this.game.reportError(error);
                return true;
            }
        });
    }

    hasAvailablePublicAction(player) {
        const publicLocations = ['active plot', 'faction', 'play area', 'revealed plots', 'title'];
        return this.game.allCards.some((card) => {
            if (!publicLocations.includes(card.location)) {
                return false;
            }

            try {
                return card.hasUsableAction(player);
            } catch (error) {
                this.game.reportError(error);
                return true;
            }
        });
    }

    passAfterDelay(offer) {
        offer.delay = this.game.responseDelay();
        this.game.afterDelay(offer.delay, () => {
            if (this.offer === offer && this.currentPlayer === offer.player) {
                this.completePlayer();
            }
        });
    }

    activePrompt(player) {
        const prompt = {
            menuTitle: 'Initiate an action',
            buttons: [{ text: 'Pass' }],
            promptTitle: this.title
        };

        if (this.offer && this.offer.player === player) {
            if (this.offer.type === 'wait') {
                prompt.controls = [{ type: 'response-delay', duration: this.offer.delay }];
            } else if (this.offer.type === 'visible-wait') {
                prompt.controls = [{ type: 'action-delay', duration: this.offer.delay }];
            }
        }

        return prompt;
    }

    skipCondition() {
        if (this.game.strictActionWindows) {
            return false;
        }

        return this.game
            .getPlayersInFirstPlayerOrder()
            .every((player) => !player.promptedActionWindows[this.windowName]);
    }

    onMenuCommand(player) {
        if (this.currentPlayer !== player) {
            return false;
        }

        this.completePlayer();

        return true;
    }

    completePlayer() {
        this.offer = null;
        super.completePlayer();
    }

    markActionAsTaken(player) {
        this.offer = null;
        this.setPlayers(this.rotatedPlayerOrder(player));
    }

    rotatedPlayerOrder(player) {
        var players = this.game.getPlayersInFirstPlayerOrder();
        var splitIndex = players.indexOf(player);
        var beforePlayer = players.slice(0, splitIndex);
        var afterPlayer = players.slice(splitIndex + 1);
        return afterPlayer.concat(beforePlayer).concat([player]);
    }
}

export default ActionWindow;
