import BaseStep from './basestep.js';
import GamePipeline from '../gamepipeline.js';
import SimpleStep from './simplestep.js';
import InterruptWindow from './InterruptWindow.js';

class EventWindow extends BaseStep {
    constructor(game, event) {
        super(game);

        this.event = event;
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new InterruptWindow(game, event),
            new SimpleStep(game, () => this.emitBaseEvent()),
            new SimpleStep(game, () => this.openWhenRevealedWindow()),
            new SimpleStep(game, () => this.openAbilityWindow('forcedreaction')),
            new SimpleStep(game, () => this.openAbilityWindow('reaction')),
            new SimpleStep(game, () => this.game.refreshGameState())
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

    onMenuCommand(player, arg, method, promptId) {
        return this.pipeline.handleMenuCommand(player, arg, method, promptId);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    continue() {
        return this.pipeline.continue();
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

    emitBaseEvent() {
        if (this.event.cancelled) {
            return;
        }

        this.event.emitTo(this.game);
    }

    openWhenRevealedWindow() {
        if (this.event.cancelled) {
            return;
        }

        if (this.event.getConcurrentEvents().some((event) => event.name === 'onPlotRevealed')) {
            this.openAbilityWindow('whenrevealed');
            this.event
                .getConcurrentEvents()
                .filter((event) => event.name === 'onPlotRevealed')
                .forEach((event) =>
                    this.game.queueSimpleStep(() => event.plot.controller.recyclePlots())
                );
        }
    }
}

export default EventWindow;
