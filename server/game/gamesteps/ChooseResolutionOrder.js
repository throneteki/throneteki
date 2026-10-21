import uuid from 'uuid';
import BaseStep from './basestep.js';

/**
 * Effects that would resolve at the same time resolve in the order the first player chooses,
 * whoever controls them (Rules Reference: Priority of Simultaneous Resolution).
 */
class ChooseResolutionOrder extends BaseStep {
    constructor(game, choices) {
        super(game);
        this.choices = choices.map((choice) => ({ id: uuid.v1(), ...choice }));
    }

    continue() {
        this.choices = this.choices.filter((choice) => !choice.canResolve || choice.canResolve());

        if (this.choices.length === 0) {
            return true;
        }

        if (this.choices.length === 1) {
            this.choices.shift().resolve();
            return true;
        }

        this.game.promptWithMenu(this.game.getFirstPlayer(), this, {
            activePrompt: {
                menuTitle: 'Choose which effect resolves next',
                buttons: this.choices.map((choice) => ({
                    text: `${choice.player.name} - ${choice.source.name}`,
                    method: 'chooseEffect',
                    arg: choice.id,
                    card: choice.source
                }))
            },
            waitingPromptTitle: 'Waiting for first player to choose the order of effects'
        });

        return false;
    }

    chooseEffect(player, id) {
        const choice = this.choices.find((choice) => choice.id === id);
        if (!choice) {
            return false;
        }

        this.choices = this.choices.filter((other) => other !== choice);
        choice.resolve();
        return true;
    }
}

export default ChooseResolutionOrder;
