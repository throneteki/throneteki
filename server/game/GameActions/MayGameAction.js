import GameAction from './GameAction.js';
import AbilityMessage from '../AbilityMessage.js';

// The context can inherit its properties from a prototype (see BaseAbility.allowsTarget), which
// spreading it would drop.
function withChoosingPlayer(context, choosingPlayer) {
    return Object.assign(Object.create(context), { choosingPlayer });
}

class MayGameAction extends GameAction {
    constructor({ player, gameAction, message, declineMessage, title }) {
        super('may');
        this.player = player || ((context) => context.player);
        this.gameAction = gameAction;
        this.abilityMessage = AbilityMessage.create(message, this.specialArgs());
        this.declineMessage = declineMessage
            ? AbilityMessage.create(declineMessage, this.specialArgs())
            : undefined;
        this.title = title;
    }

    specialArgs() {
        return {
            choosingPlayer: (context) => context.choosingPlayer
        };
    }

    message(context) {
        const choosingPlayer = this.player instanceof Function ? this.player(context) : this.player;
        let tempContext = withChoosingPlayer(context, choosingPlayer);
        return this.gameAction.message(tempContext);
    }

    allow(context) {
        const choosingPlayer = this.player instanceof Function ? this.player(context) : this.player;
        let tempContext = withChoosingPlayer(context, choosingPlayer);
        return this.gameAction.allow(tempContext);
    }

    logsOwnMessage() {
        return true;
    }

    createEvent(context) {
        return this.event('__PLACEHOLDER_EVENT__', {}, (event) => {
            const title = this.title instanceof Function ? this.title(context) : this.title;
            const choosingPlayer =
                this.player instanceof Function ? this.player(context) : this.player;
            let tempContext = withChoosingPlayer(context, choosingPlayer);
            const handler = new MayPromptHandler({
                yesHandler: () => {
                    if (this.gameAction.allow(tempContext)) {
                        this.abilityMessage.output(
                            tempContext.game,
                            Object.assign(Object.create(tempContext), {
                                gameAction: this.gameAction
                            })
                        );
                        event.thenAttachEvent(this.gameAction.createEvent(tempContext));
                    }
                    return true;
                },
                noHandler: () => {
                    if (this.declineMessage) {
                        this.declineMessage.output(tempContext.game, tempContext);
                    }
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
