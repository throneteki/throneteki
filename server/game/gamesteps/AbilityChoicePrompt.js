import AbilityMessage from '../AbilityMessage.js';
import BaseStep from './basestep.js';

class AbilityChoicePrompt extends BaseStep {
    constructor({
        game,
        context,
        choosingPlayer,
        title,
        choices,
        cancelText,
        cancelMessage,
        gameActionResolver
    }) {
        super(game);
        this.context = context;
        this.choosingPlayer = choosingPlayer || this.context.choosingPlayer;
        this.title = title;
        this.choices = choices;
        this.cancelText = cancelText || 'Done';
        this.cancelMessage = AbilityMessage.create(
            cancelMessage || {
                format: '{choosingPlayer} cancels the resolution of {source} (costs were still paid)',
                type: 'danger'
            },
            { choosingPlayer: (context) => context.choosingPlayer }
        );
        this.gameActionResolver =
            gameActionResolver ||
            ((gameAction, context) => game.resolveGameAction(gameAction, context));
    }

    continue() {
        this.context.choosingPlayer = this.choosingPlayer;
        let buttons = this.choices.map((choice) => {
            if (choice.card) {
                return {
                    card: choice.card,
                    mapCard: true,
                    method: 'chooseAbilityChoice',
                    disabled: () => !choice.gameAction.allow(this.context)
                };
            }
            return {
                text: choice.text,
                arg: choice.text,
                method: 'chooseAbilityChoice',
                disabled: () => !choice.gameAction.allow(this.context)
            };
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
        let choice = this.choices.find(
            (choice) => choiceArg === choice.card || choiceArg === choice.text
        );
        if (choice && choice.gameAction.allow(this.context)) {
            this.context.selectedChoice = choice;
            choice.message.output(this.game, { ...this.context, gameAction: choice.gameAction });
            this.gameActionResolver(choice.gameAction, this.context);
        }

        return true;
    }

    skipResolution() {
        this.cancelMessage.output(this.game, this.context);
        return true;
    }
}

export default AbilityChoicePrompt;
