import AtomicEvent from '../AtomicEvent.js';
import BestowPrompt from '../gamesteps/bestowprompt.js';
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

        return this.event('onCardLeftPlay', params, (event) => {
            event.card.leavesPlay();

            for (const attachment of event.card.attachments || []) {
                event.thenAttachEvent(this.createRemoveAttachmentEvent(attachment));
            }

            for (const dupe of event.card.dupes || []) {
                event.thenAttachEvent(
                    this.createDiscardCardEvent({ card: dupe, allowSave: false })
                );
            }
        });
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
        let params = {
            card: card,
            allowSave: allowSave,
            originalLocation: card.location,
            isPillage: !!isPillage,
            isRandom: !!isRandom,
            source: source,
            snapshotName: 'cardStateWhenDiscarded'
        };
        const discardEvent = this.event('onCardDiscarded', params, (event) => {
            event.thenAttachEvent(
                this.createPlaceCardEvent({
                    card: event.card,
                    player: event.card.controller,
                    location: 'discard pile',
                    orderable
                })
            );
        });

        if (['play area', 'duplicate'].includes(card.location)) {
            return this.atomic(discardEvent, this.createLeavePlayEvent({ card, allowSave }));
        }

        return discardEvent;
    }

    createReturnCardToHandEvent({ card, allowSave = true }) {
        let params = {
            card: card,
            allowSave: allowSave,
            snapshotName: 'cardStateWhenReturned'
        };
        const returnEvent = this.event('onCardReturnedToHand', params, (event) => {
            event.thenAttachEvent(
                this.createPlaceCardEvent({
                    card: event.card,
                    player: event.card.controller,
                    location: 'hand'
                })
            );
        });

        if (['play area', 'duplicate'].includes(card.location)) {
            return this.atomic(returnEvent, this.createLeavePlayEvent({ card, allowSave }));
        }

        return returnEvent;
    }

    createPlaceCardEvent({
        card,
        player,
        location,
        bottom = false,
        orderable = orderableLocatons.includes(location)
    }) {
        player = player || card.controller;
        return this.event(
            'onCardPlaced',
            { card, location, player, bottom, orderable },
            (event) => {
                const actualPlayer =
                    event.location !== 'play area' ? event.card.owner : event.player;
                actualPlayer.placeCardInPile({ card, location, bottom });
            }
        );
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

    atomic(...events) {
        let event = new AtomicEvent();
        for (let childEvent of events) {
            event.addChildEvent(childEvent);
        }
        return event;
    }
}

export default new MoveCardEventGenerator();
