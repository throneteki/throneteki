const GameAction = require('./GameAction');
const AbilityChoicePrompt = require('../gamesteps/AbilityChoicePrompt');

class ChooseGameAction extends GameAction {
    constructor(choices) {
        super('choose');
        this.choices = this.createChoices(choices);
    }

    createChoices(choiceDefinition) {
        let choices = [];

        for(let [text, handler] of Object.entries(choiceDefinition)) {
            choices.push({ text: text, handler: handler });
        }

        return choices;
    }

    allow() {
        return this.choices.length > 0;
    }

    createEvent(context) {
        return this.event('onChoose', {}, () => {
            if(this.choices.length === 1) {
                this.choices[0].handler(context);
                return;
            }

            context.game.queueStep(new AbilityChoicePrompt(context.game, context, this.choices));
        });
    }
}

module.exports = ChooseGameAction;
