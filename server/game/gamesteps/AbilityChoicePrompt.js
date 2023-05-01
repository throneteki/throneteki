const AbilityMessage = require('../AbilityMessage');
const BaseStep = require('./basestep');

class AbilityChoicePrompt extends BaseStep {
    constructor({ game, context, choosingPlayer, title, choices, cancelText, cancelMessage }) {
        super(game);
        this.context = context;
        this.choosingPlayer = choosingPlayer || this.context.choosingPlayer;
        this.title = title;
        this.choices = choices;
        this.cancelText = cancelText || 'Done';
        this.cancelMessage = AbilityMessage.create(cancelMessage || { format: '{choosingPlayer} cancels the resolution of {source} (costs were still paid)', type: 'danger' }, { choosingPlayer: context => context.choosingPlayer });
    }

    continue() {
        this.context.choosingPlayer = this.choosingPlayer;
        let buttons = this.choices.map(choice => {
            if(choice.card) {
                return { card: choice.card, mapCard: true, method: 'chooseAbilityChoice' };
            }
            return { text: choice.text, arg: choice.text, method: 'chooseAbilityChoice' };
        });

        buttons.push({ text: this.cancelText, method: 'skipResolution' });

        this.game.promptWithMenu(this.choosingPlayer, this, {
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

    skipResolution() {
        this.cancelMessage.output(this.game, this.context);
        return true;
    }
}

module.exports = AbilityChoicePrompt;
