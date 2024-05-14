import AbilityChoiceSelection from './AbilityChoiceSelection.js';
import ChoosePlayerPrompt from './gamesteps/ChoosePlayerPrompt.js';

class AbilityChoosePlayerDefinition {
    static create(properties) {
        if (properties.chooseOpponent) {
            let opponentCondition = AbilityChoosePlayerDefinition.createConditionFunction(
                properties.chooseOpponent
            );
            return new AbilityChoosePlayerDefinition({
                name: 'opponent',
                condition: (player, context) =>
                    player !== context.choosingPlayer && opponentCondition(player, context),
                activePromptTitle: 'Select an opponent',
                waitingPromptTitle: 'Waiting for player to select an opponent'
            });
        }

        if (properties.choosePlayer) {
            return new AbilityChoosePlayerDefinition({
                name: 'chosenPlayer',
                condition: properties.choosePlayer,
                activePromptTitle: 'Select a player',
                waitingPromptTitle: 'Waiting for player to select a player'
            });
        }

        return null;
    }

    static createConditionFunction(conditionProperty) {
        if (typeof conditionProperty === 'function') {
            return conditionProperty;
        }

        return () => true;
    }

    constructor({ name, condition, activePromptTitle, waitingPromptTitle }) {
        this.name = name;
        this.condition = AbilityChoosePlayerDefinition.createConditionFunction(condition);
        this.activePromptTitle = activePromptTitle;
        this.waitingPromptTitle = waitingPromptTitle;
    }

    eligibleChoices(context) {
        context.choosingPlayer = context.player;
        return context.game.getPlayers().filter((player) => this.isEligible(player, context));
    }

    isEligible(player, context) {
        return this.condition(player, context);
    }

    canResolve(context) {
        return this.eligibleChoices(context).length > 0;
    }

    resolve(context) {
        let choices = this.eligibleChoices(context);
        let result = new AbilityChoiceSelection({
            name: this.name,
            choosingPlayer: context.player,
            eligibleChoices: choices
        });

        let prompt = new ChoosePlayerPrompt(context.game, context.player, {
            condition: (player) => choices.includes(player),
            activePromptTitle: this.activePromptTitle,
            waitingPromptTitle: this.waitingPromptTitle,
            source: context.source,
            onSelect: (chosenPlayer) => {
                if (this.name === 'opponent') {
                    context.opponent = chosenPlayer;
                } else {
                    context.chosenPlayer = chosenPlayer;
                }
                result.resolve(chosenPlayer);
            },
            onCancel: () => {
                result.cancel();
            }
        });

        context.game.queueStep(prompt);

        return result;
    }
}

export default AbilityChoosePlayerDefinition;
