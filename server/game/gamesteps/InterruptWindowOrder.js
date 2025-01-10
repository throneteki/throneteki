const OrderableEventFunc = {
    onCardPlaced: (game, events) => {
        const groupedEvents = events
            .reduce((groups, event) => {
                let existing = groups.find(
                    (group) =>
                        group.location === event.location &&
                        group.bottom === event.bottom &&
                        group.player === event.player &&
                        group.owner === event.card.owner
                );
                if (existing) {
                    existing.events.push(event);
                } else {
                    let title = 'Select order to ';
                    const owner =
                        event.player === event.card.owner ? 'your' : event.card.owner.name + "'s";
                    let orientation = event.bottom ? 'bottom' : 'top';
                    if (event.location === 'draw deck') {
                        title += `place cards on ${orientation} of ${owner} deck (${orientation} first)`;
                    }
                    if (['discard pile', 'dead pile'].includes(event.location)) {
                        title += `place cards ${orientation === 'top' ? 'in' : 'on the bottom of'} ${owner} ${event.location} (${orientation} first)`;
                    }
                    if (event.location === 'shadows') {
                        orientation = event.bottom ? 'right' : 'left';
                        title += `place cards in ${owner} shadow area (${orientation} first)`;
                    }
                    groups.push({
                        title,
                        location: event.location,
                        bottom: event.bottom,
                        player: event.player,
                        owner: event.card.owner,
                        events: [event]
                    });
                }
                return groups;
            }, [])
            .filter((group) => group.events.length > 1);

        for (let player of game.getPlayersInFirstPlayerOrder()) {
            for (let group of groupedEvents) {
                if (group.player !== player) {
                    continue;
                }

                const cardsToEvents = new Map();
                for (const event of group.events) {
                    cardsToEvents.set(event.card, event);
                }

                game.promptForSelect(player, {
                    ordered: true,
                    mode: 'exactly',
                    numCards: group.events.length,
                    activePromptTitle: group.title,
                    cardCondition: (card) => cardsToEvents.has(card),
                    onSelect: (player, selectedCards) => {
                        const orderedCards = selectedCards.reverse();
                        for (let order in orderedCards) {
                            const event = cardsToEvents.get(orderedCards[order]);
                            event.order = parseInt(order) + 1; // Start order index at 1
                        }
                        return true;
                    },
                    onCancel: () => {
                        return true;
                    }
                });
            }
        }
    }
};

const InterruptWindowOrder = {
    orderConcurrentEvents: function (game, event) {
        if (game.disableOrderPrompt) {
            return;
        }
        // Prompt for any simultaneous events which can be ordered
        for (const eventName of Object.keys(OrderableEventFunc)) {
            const orderableEvents = event
                .getConcurrentEvents()
                .filter((event) => event.name === eventName && event.orderable && !event.cancelled);
            if (orderableEvents.length > 0) {
                OrderableEventFunc[eventName](game, orderableEvents);
            }
        }
    }
};

export default InterruptWindowOrder;
