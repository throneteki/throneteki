const TriggeredAbility = require('./triggeredability.js');
const AbilityChoicePrompt = require('./gamesteps/AbilityChoicePrompt');

/**
 * Represents a reaction ability provided by card text.
 *
 * Properties:
 * when    - object whose keys are event names to listen to for the reaction and
 *           whose values are functions that return a boolean about whether to
 *           trigger the reaction when that event is fired. For example, to
 *           trigger only at the end of the challenge phase, you would do:
 *           when: {
 *               onPhaseEnded: event => event.phase === 'challenge'
 *           }
 *           Multiple events may be specified for cards that have multiple
 *           possible triggers for the same reaction.
 * title   - function that returns the string to be used as the prompt title. If
 *           none provided, then the title will be "Trigger {card name}?".
 * cost    - object or array of objects representing the cost required to be
 *           paid before the action will activate. See Costs.
 * handler - function that will be executed if the player chooses 'Yes' when
 *           asked to trigger the reaction. If the reaction has more than one
 *           choice, use the choices sub object instead.
 * choices - object whose keys are text to prompt the player and whose values
 *           are handlers when the player chooses it from the prompt.
 * limit   - optional AbilityLimit object that represents the max number of uses
 *           for the reaction as well as when it resets.
 * max     - optional AbilityLimit object that represents the max number of
 *           times the ability by card title can be used. Contrast with `limit`
 *           which limits per individual card.
 * location - string or array of strings indicating the location the card should
 *            be in in order to activate the reaction. Defaults to 'play area'.
 * player   - optional function that returns which player to prompt for the
 *            ability. By default, the player that controls the card will be
 *            prompted. Used for reactions / interrupts that any player can
 *            trigger such as The Red Wedding.
 * cannotBeCanceled - optional boolean that determines whether an ability can
 *                    be canceled using a cancel interrupt.
 */
class PromptedTriggeredAbility extends TriggeredAbility {
    constructor(game, card, type, properties) {
        super(game, card, type, properties);

        this.choices = this.createChoices(properties);
        this.title = properties.title;
    }

    getTitle(context) {
        return this.title ? this.title(context) : null;
    }

    createChoices(properties) {
        let choices = [];

        if(properties.choices) {
            for(let [text, handler] of Object.entries(properties.choices)) {
                choices.push({ text: text, handler: handler });
            }
        } else {
            choices.push({ text: 'default', handler: properties.handler });
        }

        return choices;
    }

    executeHandler(context) {
        if(this.choices.length === 0) {
            return;
        }

        if(this.choices.length === 1) {
            this.choices[0].handler(context);
            return;
        }

        this.game.queueStep(new AbilityChoicePrompt(this.game, context, this.choices));
    }
}

module.exports = PromptedTriggeredAbility;
