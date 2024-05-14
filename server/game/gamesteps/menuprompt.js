const UiPrompt = require('./uiprompt.js');

/**
 * General purpose menu prompt. By specifying a context object, the buttons in
 * the active prompt can call the corresponding method on the context object.
 * Methods on the contact object should return true in order to complete the
 * prompt.
 *
 * The properties option object may contain the following:
 * activePrompt       - the full prompt to display for the prompted player.
 * waitingPromptTitle - the title to display for opponents.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 * hideSourceFromOpponents - boolean that indicates whether an opponent should be
 *                      able to see the card a player is using.
 */
class MenuPrompt extends UiPrompt {
    constructor(game, player, context, properties) {
        super(game);
        this.player = player;
        this.context = context;

        if (
            properties.source &&
            !properties.waitingPromptTitle &&
            !properties.hideSourceFromOpponents
        ) {
            properties.waitingPromptTitle = 'Waiting for opponent to use ' + properties.source.name;
        }

        this.properties = properties;

        if (player.isFake) {
            this.complete();
        }
    }

    activeCondition(player) {
        return player === this.player;
    }

    activePrompt() {
        let promptTitle =
            this.properties.promptTitle ||
            (this.properties.source ? this.properties.source.name : undefined);

        return Object.assign({ promptTitle: promptTitle }, this.properties.activePrompt);
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onMenuCommand(player, arg, method) {
        if (player !== this.player) {
            return false;
        }

        const methodButton = this.getButton(method, arg);
        if (!this.context[method] || (this.properties.activePrompt.buttons && !methodButton)) {
            return false;
        }

        let contextArg = arg;
        if (methodButton && methodButton.card && methodButton.mapCard) {
            contextArg = methodButton.card;
        }

        if (this.context[method](player, contextArg, method)) {
            this.complete();
        }

        return true;
    }

    getButton(method, arg) {
        return (
            this.properties.activePrompt.buttons &&
            this.properties.activePrompt.buttons.find(
                (button) =>
                    button.method === method && (!button.mapCard || button.card.uuid === arg)
            )
        );
    }

    getPlayer() {
        return this.player;
    }
}

module.exports = MenuPrompt;
