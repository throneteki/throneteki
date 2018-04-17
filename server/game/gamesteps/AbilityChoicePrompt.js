const BaseStep = require('./basestep');

class AbilityChoicePrompt extends BaseStep {
    constructor(game, context, choices) {
        super(game);
        this.context = context;
        this.choices = choices;
    }

    continue() {
        let buttons = this.choices.map(choice => {
            return { text: choice.text, arg: choice.text, method: 'chooseAbilityChoice' };
        });

        buttons.push({ text: 'Done', method: 'skipResolution' });

        this.game.promptWithMenu(this.context.player, this, {
            activePrompt: {
                menuTitle: `Choose ability for ${this.context.source.name}`,
                buttons: buttons
            },
            source: this.card
        });
    }

    chooseAbilityChoice(player, choiceText) {
        let choice = this.choices.find(choice => choice.text === choiceText);

        if(choice) {
            choice.handler(this.context);
        }

        return true;
    }

    skipResolution() {
        this.game.addAlert('{0} cancels the resolution of {1} (costs were still paid)', this.context.player, this.context.source);
        return true;
    }
}

module.exports = AbilityChoicePrompt;
