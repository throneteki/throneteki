const GameAction = require('./GameAction');
const AbilityChoicePrompt = require('../gamesteps/AbilityChoicePrompt');
const AbilityMessage = require('../AbilityMessage');
const HandlerGameActionWrapper = require('./HandlerGameActionWrapper');

class ChooseGameAction extends GameAction {
    constructor({ player, title, message, choices }) {
        super('choose');
        this.playerFunc = player || (context => context.player);
        this.title = title || (context => `Choose one for ${context.source.name}`);
        this.defaultMessage = AbilityMessage.create(message, this.specialArgs());
        this.choicesFunc = choices instanceof Function ? choices : () => choices;
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
        const choices = this.createChoices(this.choicesFunc(context));
        const validChoices = choices.filter(choice => choice.condition(context)/* && choice.gameAction.allow(context)*/); // Allow check disabled due to affecting various tests
        return validChoices.length > 0;
    }

    createEvent(context) {
        return this.event('onChoose', {}, () => {
            const choosingPlayer = this.playerFunc(context);
            const title = this.title instanceof Function ? this.title(context) : this.title;
            const choices = this.createChoices(this.choicesFunc(context));
            const validChoices = choices.filter(choice => choice.condition(context)/* && choice.gameAction.allow(context)*/); // Allow check disabled due to affecting various tests
            context.choosingPlayer = choosingPlayer;
            if(validChoices.length === 1) {
                context.selectedChoice = validChoices[0];
                context.selectedChoice.message.output(context.game, context);
                context.game.resolveGameAction(context.selectedChoice.gameAction, context);
                return;
            }

            context.game.queueStep(new AbilityChoicePrompt(context.game, context, title, validChoices));
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
