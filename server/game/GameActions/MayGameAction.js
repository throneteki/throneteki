import GameAction from './GameAction.js';
import AbilityMessage from '../AbilityMessage.js';

class MayGameAction extends GameAction {
    constructor({ player, gameAction, message, title }) {
        super('may');
        this.player = player || ((context) => context.player);
        this.gameAction = gameAction;
        this.abilityMessage = AbilityMessage.create(message, this.specialArgs());
        this.title = title;
    }

    specialArgs() {
        return {
            choosingPlayer: (context) => context.choosingPlayer
        };
    }

    message(context) {
        const choosingPlayer = this.player instanceof Function ? this.player(context) : this.player;
        let tempContext = { ...context, choosingPlayer };
        return this.gameAction.message(tempContext);
    }

    allow(context) {
        const choosingPlayer = this.player instanceof Function ? this.player(context) : this.player;
        let tempContext = { ...context, choosingPlayer };
        return this.gameAction.allow(tempContext);
    }

    createEvent(context) {
        return this.event('__PLACEHOLDER_EVENT__', {}, (event) => {
            const title = this.title instanceof Function ? this.title(context) : this.title;
            const choosingPlayer =
                this.player instanceof Function ? this.player(context) : this.player;
            let tempContext = { ...context, choosingPlayer };
            const handler = new MayPromptHandler({
                yesHandler: () => {
                    if (this.gameAction.allow(tempContext)) {
                        this.abilityMessage.output(tempContext.game, {
                            ...tempContext,
                            gameAction: this.gameAction
                        });
                        event.thenAttachEvent(this.gameAction.createEvent(tempContext));
                    }
                    return true;
                }
            });
            handler.prompt({
                game: tempContext.game,
                choosingPlayer,
                title,
                source: tempContext.source
            });
        });
    }
}

class MayPromptHandler {
    constructor({ yesHandler, noHandler = () => {} }) {
        this.yesHandler = yesHandler;
        this.noHandler = noHandler;
    }

    prompt({ game, choosingPlayer, source, title }) {
        game.promptWithMenu(choosingPlayer, this, {
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
        if (arg) {
            this.yesHandler();
        } else {
            this.noHandler();
        }
        return true;
    }
}

export default MayGameAction;
