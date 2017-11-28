const BaseStep = require('./basestep.js');
const GamePipeline = require('../gamepipeline.js');
const SimpleStep = require('./simplestep.js');

class EventWindow extends BaseStep {
    constructor(game, event) {
        super(game);

        this.event = event;
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(game, () => this.openAbilityWindow('cancelinterrupt')),
            new SimpleStep(game, () => this.automaticSaveWithDupes()),
            new SimpleStep(game, () => this.openAbilityWindow('forcedinterrupt')),
            new SimpleStep(game, () => this.openAbilityWindow('interrupt')),
            new SimpleStep(game, () => this.executeHandler()),
            new SimpleStep(game, () => this.openAbilityWindow('forcedreaction')),
            new SimpleStep(game, () => this.openAbilityWindow('reaction'))
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

    automaticSaveWithDupes() {
        if(this.event.cancelled || !this.event.allowAutomaticSave()) {
            return;
        }

        if(this.event.card && this.game.saveWithDupe(this.event.card)) {
            this.event.cancel();
        }
    }

    openAbilityWindow(abilityType) {
        if(this.event.cancelled) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: abilityType,
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
            this.openAbilityWindow('whenrevealed');
        }
    }
}

module.exports = EventWindow;
