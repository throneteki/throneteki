import AtomicEvent from '../AtomicEvent.js';
import BestowPrompt from '../gamesteps/bestowprompt.js';
import CompositeEvent from '../CompositeEvent.js';
import Event from '../event.js';

const orderableLocatons = ['draw deck', 'shadows', 'discard pile', 'dead pile'];

class MoveCardEventGenerator {
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
        const discardEvent = this.compositeEvent('onCardDiscarded', params, {
            name: 'placeCard',
            event: placeCardEvent
        });

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
        const killedEvent = this.compositeEvent('onCharacterKilled', params, {
            name: 'placeCard',
            event: placeCardEvent
        });

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
        const sacrificeEvent = this.compositeEvent('onSacrificed', params, {
            name: 'placeCard',
            event: placeCardEvent
        });

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
        const returnEvent = this.compositeEvent('onCardReturnedToHand', params, {
            name: 'placeCard',
            event: placeCardEvent
        });

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
        const returnEvent = this.compositeEvent('onCardReturnedToDeck', params, {
            name: 'placeCard',
            event: placeCardEvent
        });

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
        const putEvent = this.compositeEvent('onCardPutIntoShadows', params, {
            name: 'placeCard',
            event: placeCardEvent
        });

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
        const onCardPlacedEvent = this.event(
            'onCardPlaced',
            { card, location, player, bottom, orderable },
            (event) => {
                const actualPlayer =
                    event.location !== 'play area' ? event.card.owner : event.player;
                actualPlayer.placeCardInPile({ card, location, bottom });
            }
        );

        if (
            ['play area', 'duplicate'].includes(card.location) &&
            !['play area', 'duplicate'].includes(location)
        ) {
            return this.atomic(onCardPlacedEvent, this.createLeavePlayEvent({ card, allowSave }));
        }
        // TODO: Handle entering play as well

        return onCardPlacedEvent;
    }

    createEntersPlayEvent({ card, player, playingType = 'play', kneeled = false, isDupe = false }) {
        const originalLocation = card.location;

        player = player || card.controller;
        const game = player.game;
        const isFullyResolved = (event) => event.card.location === 'play area';

        return this.event(
            'onCardEntersPlay',
            { card, playingType, originalLocation, isFullyResolved },
            (event) => {
                // Attachments placed in setup should not be considered to be 'played',
                // as it will cause then to double their effects when attached later.
                let isSetupAttachment =
                    playingType === 'setup' && event.card.getPrintedType() === 'attachment';

                let originalFacedownState = event.card.facedown;
                event.card.facedown = game.currentPhase === 'setup';
                event.card.new = true;
                player.placeCardInPile({
                    card: event.card,
                    location: 'play area',
                    wasFacedown: originalFacedownState
                });
                event.card.takeControl(player);
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
            }
        );
    }

    event(name, params, handler) {
        return new Event(name, params, handler);
    }

    compositeEvent(name, params, ...events) {
        const compositeEvent = new CompositeEvent(name, params);
        for (const event of events) {
            if (event.name && event.event) {
                compositeEvent.setChildEvent(event.name, event.event);
            } else {
                compositeEvent.addChildEvent(event);
            }
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
