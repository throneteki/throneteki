import GameAction from './GameAction.js';
import SimultaneousActions from './SimultaneousActions.js';

class ForEachSelection extends GameAction {
    constructor(name, gameAction) {
        super('forEachSelection');

        this.targetName = name;
        this.gameAction = gameAction;
    }

    message(context) {
        return this.actionFor(context).message(context);
    }

    resultMessage(context, event) {
        return this.actionFor(context).resultMessage(context, event);
    }

    logsOwnMessage() {
        return this.gameAction.logsOwnMessage();
    }

    allow(context) {
        return this.actionFor(context).allow(context);
    }

    createEvent(context) {
        return this.actionFor(context).createEvent(context);
    }

    actionFor(context) {
        const selections = context.targets
            ? context.targets.getSelectionsByName(this.targetName)
            : [];
        return new SimultaneousActions(
            selections.map((selection) => this.boundTo(this.selectionContext(context, selection)))
        );
    }

    selectionContext(context, selection) {
        const selectionContext = Object.create(context);
        selectionContext.targets = Object.create(context.targets);
        selectionContext.targets[this.targetName] = selection.value;
        selectionContext.choosingPlayer = selection.choosingPlayer;
        if (this.targetName === 'target') {
            selectionContext.target = selection.value;
        }
        return selectionContext;
    }

    boundTo(selectionContext) {
        const gameAction = this.gameAction;
        return {
            message: () => gameAction.message(selectionContext),
            resultMessage: (context, event) => gameAction.resultMessage(selectionContext, event),
            logsOwnMessage: () => gameAction.logsOwnMessage(),
            allow: () => gameAction.allow(selectionContext),
            createEvent: () => gameAction.createEvent(selectionContext)
        };
    }
}

export default ForEachSelection;
