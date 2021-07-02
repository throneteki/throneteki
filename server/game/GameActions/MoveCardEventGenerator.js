const AtomicEvent = require('../AtomicEvent');
const Event = require('../event');

class MoveCardEventGenerator {
    createLeavePlayEvent({ card, allowSave = false }) {
        const params = {
            card,
            allowSave,
            automaticSaveWithDupe: true,
            snapshotName: 'cardStateWhenLeftPlay'
        };

        return this.event('onCardLeftPlay', params, event => {
            event.card.leavesPlay();

            for(const attachment of event.card.attachments || []) {
                event.thenAttachEvent(this.createRemoveAttachmentEvent(attachment));
            }

            for(const dupe of event.card.dupes || []) {
                event.thenAttachEvent(this.createDiscardCardEvent({ card: dupe, allowSave: false }));
            }
        });
    }

    createRemoveAttachmentEvent(attachment) {
        attachment.isBeingRemoved = true;

        if(attachment.isTerminal()) {
            return this.createDiscardCardEvent({ card: attachment }).thenExecute(() => {
                attachment.isBeingRemoved = false;
            });
        }

        return this.createReturnCardToHandEvent({ card: attachment }).thenExecute(() => {
            attachment.isBeingRemoved = false;
        });
    }

    createDiscardCardEvent({ card, allowSave = true, isPillage = false, source }) {
        let params = {
            card: card,
            allowSave: allowSave,
            automaticSaveWithDupe: true,
            originalLocation: card.location,
            isPillage: !!isPillage,
            source: source,
            snapshotName: 'cardStateWhenDiscarded'
        };
        const discardEvent = this.event('onCardDiscarded', params, event => {
            event.thenAttachEvent(this.createPlaceCardEvent({ card: event.card, player: event.card.controller, location: 'discard pile' }));
        });

        if(['play area', 'duplicate'].includes(card.location)) {
            return this.atomic(
                discardEvent,
                this.createLeavePlayEvent({ card, allowSave })
            );
        }

        return discardEvent;
    }

    createReturnCardToHandEvent({ card, allowSave = true }) {
        let params = {
            card: card,
            allowSave: allowSave,
            automaticSaveWithDupe: true
        };
        return this.event('onCardReturnedToHand', params, event => {
            event.cardStateWhenReturned = card.createSnapshot();
            event.card.controller.moveCard(card, 'hand', { allowSave: allowSave });
        });
    }

    createPlaceCardEvent({ card, player, location, bottom = false }) {
        player = player || card.controller;
        return this.event('onCardPlaced', { card, location, player, bottom }, event => {
            const actualPlayer = event.location !== 'play area' ? event.card.owner : event.player;
            actualPlayer.placeCardInPile({ card, location, bottom });
        });
    }

    event(name, params, handler) {
        return new Event(name, params, handler);
    }

    atomic(...events) {
        let event = new AtomicEvent();
        for(let childEvent of events) {
            event.addChildEvent(childEvent);
        }
        return event;
    }
}

module.exports = new MoveCardEventGenerator();
