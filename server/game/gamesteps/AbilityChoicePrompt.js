const BaseStep = require('./basestep');

class AbilityChoicePrompt extends BaseStep {
    constructor(game, context, title, choices) {
        super(game);
        this.context = context;
        this.title = title;
        this.choices = choices;
    }

    continue() {
        let buttons = this.choices.map(choice => {
            if(choice.card) {
                return { card: choice.card, mapCard: true, method: 'chooseAbilityChoice' };
            }
            return { text: choice.text, arg: choice.text, method: 'chooseAbilityChoice' };
        });

        buttons.push({ text: 'Done', method: 'skipResolution' });

        this.game.promptWithMenu(this.context.choosingPlayer, this, {
            activePrompt: {
                menuTitle: this.title,
                buttons: buttons
            },
            source: this.card
        });
    }

    chooseAbilityChoice(player, choiceArg) {
        let choice = this.choices.find(choice => choiceArg === choice.card || choiceArg === choice.text);
        if(choice) {
            this.context.selectedChoice = choice;
            choice.message.output(this.game, this.context);
            this.game.resolveGameAction(choice.gameAction, this.context);
        }

        return true;
    }

    skipResolution(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1} (costs were still paid)', player, this.context.source);
        return true;
    }
}

module.exports = AbilityChoicePrompt;
