const GameAction = require('./GameAction');
const AbilityMessage = require('../AbilityMessage');

class MayGameAction extends GameAction {
    constructor({ gameAction, message, title }) {
        super('may');

        this.gameAction = gameAction;
        this.message = AbilityMessage.create(message);
        this.title = title;
    }

    message(context) {
        return this.gameAction.message(context);
    }

    allow(context) {
        return this.gameAction.allow(context);
    }

    createEvent(context) {
        const titleString = this.title instanceof Function ? this.title(context) : this.title;

        return this.event('__PLACEHOLDER_EVENT__', {}, event => {
            const handler = new MayPromptHandler({
                yesHandler: () => {
                    if(this.gameAction.allow(context)) {
                        this.message.output(context.game, context);
                        event.thenAttachEvent(this.gameAction.createEvent(context));
                    }
                    return true;
                }
            });
            handler.prompt({
                game: context.game,
                player: context.player,
                title: titleString,
                source: context.source
            });
        });
    }
}

class MayPromptHandler {
    constructor({ yesHandler, noHandler = (() => {}) }) {
        this.yesHandler = yesHandler;
        this.noHandler = noHandler;
    }

    prompt({ game, player, source, title }) {
        game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: title,
                buttons: [
                    { text: 'Yes', method: 'handle', arg: true },
                    { text: 'No', method: 'handle', arg: false }
                ]
            },
            source
        });
    }

    handle(player, arg) {
        if(arg) {
            this.yesHandler();
        } else {
            this.noHandler();
        }
        return true;
    }
}

module.exports = MayGameAction;
