import BaseStep from './basestep.js';
import GamePipeline from '../gamepipeline.js';
import SimpleStep from './simplestep.js';
import InterruptWindowOrder from './InterruptWindowOrder.js';

class InterruptWindow extends BaseStep {
    constructor(game, event, postHandlerFunc = () => true) {
        super(game);

        this.event = event;
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(game, () => this.openAbilityWindow('cancelinterrupt')),
            new SimpleStep(game, () => this.automaticSaveWithDupes()),
            new SimpleStep(game, () => this.openAbilityWindow('forcedinterrupt')),
            new SimpleStep(game, () => this.openAbilityWindow('interrupt')),
            new SimpleStep(game, () => this.validateExecution()),
            new SimpleStep(game, () => this.selectExecuteOrder()),
            new SimpleStep(game, () => this.executeHandler()),
            new SimpleStep(game, () => this.openWindowForAttachedEvents()),
            new SimpleStep(game, () => this.executePostHandler()),
            new SimpleStep(game, () => this.openWindowForAttachedEvents())
        ]);
        this.postHandlerFunc = postHandlerFunc;
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

    onMenuCommand(player, arg, method, promptId) {
        return this.pipeline.handleMenuCommand(player, arg, method, promptId);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    continue() {
        return this.pipeline.continue();
    }

    automaticSaveWithDupes() {
        if (this.event.cancelled) {
            return;
        }

        for (let event of this.event.getConcurrentEvents()) {
            if (event.allowAutomaticSave() && this.game.saveWithDupe(event.card)) {
                event.cancel();
            }
        }
    }

    openAbilityWindow(abilityType) {
        if (this.event.cancelled) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: abilityType,
            event: this.event
        });
    }

    validateExecution() {
        if (this.event.cancelled) {
            return;
        }

        this.event.checkExecuteValidity();
    }

    selectExecuteOrder() {
        if (this.event.cancelled) {
            return;
        }

        InterruptWindowOrder.orderConcurrentEvents(this.game, this.event);
    }

    executeHandler() {
        if (this.event.cancelled) {
            return;
        }

        this.event.executeHandler();
    }

    openWindowForAttachedEvents() {
        if (this.event.cancelled) {
            return;
        }

        this.game.openInterruptWindowForAttachedEvents(this.event);
    }

    executePostHandler() {
        if (this.event.cancelled) {
            return;
        }

        this.event.executePostHandler();
        this.postHandlerFunc();
    }
}

export default InterruptWindow;
