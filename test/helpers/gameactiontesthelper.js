export function resolveGameAction(game, action, props) {
    const baseAction = action.action || action;
    const actionProps = action.resolveProperties ? action.resolveProperties(props) : props;
    if (!baseAction.canChangeGameState(actionProps)) {
        return undefined;
    }

    const event = action.createEvent(props);
    game.resolveEvent(event);
    return event;
}

export function executeTestEvent(event) {
    if (!event) {
        return;
    }

    event.executeHandler();

    const executeAttachedEvents = (currentEvent) => {
        for (const child of currentEvent.childEvents || []) {
            executeAttachedEvents(child);
        }

        for (const attached of currentEvent.attachedEvents || []) {
            attached.executeHandler();
            executeAttachedEvents(attached);
            attached.executePostHandler();
        }
        currentEvent.attachedEvents = [];
    };

    executeAttachedEvents(event);
    event.executePostHandler();
}
