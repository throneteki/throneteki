const GameAction = require('./GameAction');
const AbilityChoicePrompt = require('../gamesteps/AbilityChoicePrompt');
const AbilityMessage = require('../AbilityMessage');
const HandlerGameActionWrapper = require('./HandlerGameActionWrapper');

class ChooseGameAction extends GameAction {
    constructor({ player, title, message, choices, cancelText, cancelMessage }) {
        super('choose');
        this.playerFunc = player || (context => context.player);
        this.title = title || (context => `Choose one for ${context.source.name}`);
        this.defaultMessage = AbilityMessage.create(message, this.specialArgs());
        this.choicesFunc = choices instanceof Function ? choices : () => choices;
        this.cancelText = cancelText;
        this.cancelMessage = cancelMessage;
    }

    specialArgs() {
        return {
            choosingPlayer: context => context.choosingPlayer,
            choice: context => context.selectedChoice.card || context.selectedChoice.text
        };
    }

    message(context) {
        if(context.selectedChoice) {
            return context.selectedChoice.gameAction.message(context);
        }
        return null;
    }

    allow(context) {
        const choosingPlayer = this.playerFunc(context);
        let tempContext = { ...context, choosingPlayer };
        const choices = this.createChoices(this.choicesFunc(tempContext));
        const validChoices = choices.filter(choice => choice.condition(tempContext));
        return validChoices.length > 0;
    }

    createEvent(context) {
        return this.event('onChoose', {}, event => {
            const choosingPlayer = this.playerFunc(context);
            let tempContext = { ...context, choosingPlayer };
            const title = this.title instanceof Function ? this.title(tempContext) : this.title;
            const choices = this.createChoices(this.choicesFunc(tempContext)); // If at least one choice is selectable (checked in 'allow'), then all should be selectable.
            const cancelText = this.cancelText instanceof Function ? this.cancelText(tempContext) : this.cancelText;
            const cancelMessage = this.cancelMessage instanceof Function ? this.cancelMessage(tempContext) : this.cancelMessage;

            context.game.queueStep(new AbilityChoicePrompt({
                game: context.game,
                context,
                choosingPlayer,
                title,
                choices,
                cancelText,
                cancelMessage,
                gameActionResolver: gameAction => {
                    event.thenAttachEvent(gameAction.createEvent(context));
                }
            }));
        });
    }

    createChoices(choiceDefinition) {
        let choices = [];
        for(let [text, action] of Object.entries(choiceDefinition)) {
            let gameAction = this.buildGameAction(action);
            let condition = action.gameAction && action.condition ? action.condition : () => true;
            let message = action.gameAction && action.message ? AbilityMessage.create(action.message, this.specialArgs()) : this.defaultMessage;
            let card = action.gameAction && action.card;

            choices.push({
                text: text,
                gameAction: gameAction,
                condition: condition,
                message: message,
                card: card
            });
        }

        return choices;
    }

    buildGameAction(action) {
        // Supporting legacy Choices as handlers
        if(typeof(action) === 'function') {
            return new HandlerGameActionWrapper({ handler: action });
        }
        // Supporting properties-based choice
        if(action.gameAction) {
            return action.gameAction;
        }
        // Defaulting to a GameAction as a choice
        return action;
    }
}

module.exports = ChooseGameAction;
