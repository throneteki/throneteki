import AtomicEvent from '../AtomicEvent.js';
import BestowPrompt from '../gamesteps/bestowprompt.js';
import CompositeEvent from '../CompositeEvent.js';
import Event from '../event.js';

const orderableLocatons = ['draw deck', 'shadows', 'discard pile', 'dead pile'];

class MoveCardEventGenerator {
    createDiscardCardEvent({
        card,
        allowSave = true,
        isPillage = false,
        isRandom = false,
        source,
        orderable
    }) {
        const params = {
            card: card,
            allowSave: allowSave,
            originalLocation: card.location,
            isPillage: !!isPillage,
            isRandom: !!isRandom,
            source: source,
            snapshotName: 'cardStateWhenDiscarded'
        };

        const placeCardEvent = this.createPlaceCardEvent({
            card,
            player: card.controller,
            location: 'discard pile',
            allowSave,
            orderable
        });
        const discardEvent = this.composite('onCardDiscarded', params);
        discardEvent.setChildEvent('placeCard', placeCardEvent);

        return discardEvent;
    }

    createKillCharacterEvent({ card, allowSave = true, isBurn = false }) {
        const params = {
            card,
            allowSave,
            isBurn,
            snapshotName: 'cardStateWhenKilled'
        };
        const placeCardEvent = this.createPlaceCardEvent({
            card,
            player: card.controller,
            location: 'dead pile',
            allowSave
        });
        const killedEvent = this.composite('onCharacterKilled', params);
        killedEvent.setChildEvent('placeCard', placeCardEvent);

        return killedEvent;
    }

    createSacrificeCardEvent({ card, player }) {
        player = player || card.controller;
        const params = {
            card,
            player,
            snapshotName: 'cardStateWhenSacrificed'
        };
        const placeCardEvent = this.createPlaceCardEvent({
            card,
            player: card.controller,
            location: 'discard pile'
        });
        const sacrificeEvent = this.composite('onSacrificed', params);
        sacrificeEvent.setChildEvent('placeCard', placeCardEvent);

        return sacrificeEvent;
    }

    createReturnCardToHandEvent({ card, allowSave = true }) {
        const params = {
            card: card,
            allowSave: allowSave,
            snapshotName: 'cardStateWhenReturned'
        };

        const placeCardEvent = this.createPlaceCardEvent({
            card,
            player: card.controller,
            location: 'hand',
            allowSave
        });
        const returnEvent = this.composite('onCardReturnedToHand', params);
        returnEvent.setChildEvent('placeCard', placeCardEvent);

        return returnEvent;
    }

    createReturnCardToDeckEvent({ card, allowSave = true, bottom = false, orderable }) {
        const params = {
            card: card,
            allowSave: allowSave,
            bottom: bottom,
            snapshotName: 'cardStateWhenReturned'
        };

        const placeCardEvent = this.createPlaceCardEvent({
            card,
            player: card.controller,
            location: 'draw deck',
            allowSave,
            bottom,
            orderable
        });
        const returnEvent = this.composite('onCardReturnedToDeck', params);
        returnEvent.setChildEvent('placeCard', placeCardEvent);

        return returnEvent;
    }

    createPutIntoShadowsEvent({ card, allowSave = true, reason = 'ability' }) {
        const params = {
            card,
            allowSave,
            snapshotName: 'cardStateWhenPut',
            reason
        };

        const placeCardEvent = this.createPlaceCardEvent({
            card,
            player: card.controller,
            allowSave,
            location: 'shadows'
        });
        const putEvent = this.composite('onCardPutIntoShadows', params);
        putEvent.setChildEvent('placeCard', placeCardEvent);

        return putEvent;
    }

    createPlaceCardEvent({
        card,
        player,
        location,
        allowSave,
        bottom = false,
        orderable = orderableLocatons.includes(location)
    }) {
        player = player || card.controller;
        const params = {
            card,
            location,
            player,
            bottom,
            orderable,
            snapshotName: 'cardStateWhenPlaced'
        };
        const onCardPlacedEvent = this.event('onCardPlaced', params, (event) => {
            const actualPlayer = event.location !== 'play area' ? event.card.owner : event.player;
            actualPlayer.placeCardInPile({ card, location, bottom });
        });

        if (
            ['play area', 'duplicate'].includes(card.location) &&
            !['play area', 'duplicate'].includes(location)
        ) {
            const onLeavePlayEvent = this.createLeavePlayEvent({ card, allowSave });
            return this.atomic(onLeavePlayEvent, onCardPlacedEvent);
        }
        // TODO: Handle entering play as well (requires larger edits)

        return onCardPlacedEvent;
    }

    createEntersPlayEvent({ card, player, playingType = 'play', kneeled = false, isDupe = false }) {
        player = player || card.controller;
        const originalLocation = card.location;
        const isFullyResolved = (event) => event.card.location === 'play area';
        const params = {
            card,
            playingType,
            player,
            originalLocation,
            isFullyResolved
        };

        return this.event('onCardEntersPlay', params, (event) => {
            const game = event.player.game;

            // Attachments placed in setup should not be considered to be 'played',
            // as it will cause then to double their effects when attached later.
            const isSetupAttachment =
                playingType === 'setup' && event.card.getPrintedType() === 'attachment';

            const originalFacedownState = event.card.facedown;
            event.card.facedown = game.currentPhase === 'setup';
            event.card.new = true;
            event.player.placeCardInPile({
                card: event.card,
                location: 'play area',
                wasFacedown: originalFacedownState
            });
            event.card.takeControl(event.player);
            event.card.kneeled =
                (playingType !== 'setup' && !!event.card.entersPlayKneeled) || !!kneeled;

            if (!isDupe && !isSetupAttachment) {
                event.card.applyPersistentEffects();
            }

            game.queueSimpleStep(() => {
                if (game.currentPhase !== 'setup' && event.card.isBestow()) {
                    game.queueStep(new BestowPrompt(game, player, event.card));
                }
            });
        });
    }

    createLeavePlayEvent({ card, allowSave = false }) {
        const params = {
            card,
            allowSave,
            automaticSaveWithDupe: true,
            snapshotName: 'cardStateWhenLeftPlay'
        };

        const leavePlayEvent = this.event('onCardLeftPlay', params, (event) => {
            event.card.leavesPlay();
        });
        for (const attachment of card.attachments || []) {
            leavePlayEvent.addChildEvent(this.createRemoveAttachmentEvent(attachment));
        }
        for (const dupe of card.dupes || []) {
            leavePlayEvent.addChildEvent(
                this.createDiscardCardEvent({ card: dupe, allowSave: false })
            );
        }

        return leavePlayEvent;
    }

    createRemoveAttachmentEvent(attachment) {
        attachment.isBeingRemoved = true;

        if (attachment.isTerminal()) {
            return this.createDiscardCardEvent({ card: attachment }).thenExecute(() => {
                attachment.isBeingRemoved = false;
            });
        }

        return this.createReturnCardToHandEvent({ card: attachment }).thenExecute(() => {
            attachment.isBeingRemoved = false;
        });
    }

    event(name, params, handler) {
        return new Event(name, params, handler);
    }

    composite(name, params, ...events) {
        const compositeEvent = new CompositeEvent(name, params);
        for (const event of events) {
            compositeEvent.addChildEvent(event);
        }
        return compositeEvent;
    }

    atomic(...events) {
        let event = new AtomicEvent();
        for (let childEvent of events) {
            event.addChildEvent(childEvent);
        }
        return event;
    }
}

export default new MoveCardEventGenerator();
