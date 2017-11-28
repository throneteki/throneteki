const BaseStep = require('./basestep.js');
const GamePipeline = require('../gamepipeline.js');
const SimpleStep = require('./simplestep.js');

class EventWindow extends BaseStep {
    constructor(game, event) {
        super(game);

        this.event = event;
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(game, () => this.cancelInterrupts()),
            new SimpleStep(game, () => this.automaticSaveWithDupes()),
            new SimpleStep(game, () => this.forcedInterrupts()),
            new SimpleStep(game, () => this.interrupts()),
            new SimpleStep(game, () => this.executeHandler()),
            new SimpleStep(game, () => this.forcedReactions()),
            new SimpleStep(game, () => this.reactions())
        ]);
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    isComplete() {
        return this.pipeline.length === 0;
    }

    onCardClicked(player, card) {
        return this.pipeline.handleCardClicked(player, card);
    }

    onMenuCommand(player, arg, method) {
        return this.pipeline.handleMenuCommand(player, arg, method);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    continue() {
        return this.pipeline.continue();
    }

    cancelInterrupts() {
        this.game.openAbilityWindow({
            abilityType: 'cancelinterrupt',
            event: this.event
        });
    }

    automaticSaveWithDupes() {
        if(this.event.cancelled || !this.event.allowAutomaticSave()) {
            return;
        }

        if(this.event.card && this.game.saveWithDupe(this.event.card)) {
            this.event.cancel();
        }
    }

    forcedInterrupts() {
        if(this.event.cancelled) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: 'forcedinterrupt',
            event: this.event
        });
    }

    interrupts() {
        if(this.event.cancelled) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: 'interrupt',
            event: this.event
        });
    }

    executeHandler() {
        if(this.event.cancelled) {
            return;
        }

        this.event.executeHandler();

        if(this.event.cancelled) {
            return;
        }

        this.event.emitTo(this.game);
        if(this.event.name === 'onPlotsWhenRevealed') {
            this.game.openAbilityWindow({
                abilityType: 'whenrevealed',
                event: this.event
            });
        }
    }

    forcedReactions() {
        if(this.event.cancelled) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: 'forcedreaction',
            event: this.event
        });
    }

    reactions() {
        if(this.event.cancelled) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: 'reaction',
            event: this.event
        });
    }
}

module.exports = EventWindow;
