import GameAction from './GameAction.js';
import Message from '../Message.js';
import BestowPrompt from '../gamesteps/bestowprompt.js';

class Attach extends GameAction {
    constructor() {
        super('attach');
    }

    message({ attachment, target }) {
        return Message.fragment('attaches {attachment} to {target}', { attachment, target });
    }

    canChangeGameState({ player, attachment, target, facedown = false }) {
        player = player || attachment.controller;
        return (
            !!target &&
            target.location === 'play area' &&
            attachment.parent !== target &&
            (facedown || player.canAttach(attachment, target))
        );
    }

    createEvent({ player, attachment, target, playingType = 'play', facedown = false }) {
        player = player || attachment.controller;
        const originalLocation = attachment.location;
        const dupeCard = facedown ? null : player.getDuplicateInPlay(attachment);

        if (dupeCard && dupeCard.controller === attachment.controller) {
            return this.atomic(
                this.event('onDupeEntersPlay', { card: attachment, target: dupeCard }, (event) => {
                    event.card.owner.removeCardFromPile(event.card);
                    event.target.addDuplicate(event.card);
                }),
                ...this.outOfShadowsEvents({
                    player,
                    card: attachment,
                    originalLocation,
                    type: 'dupe'
                })
            );
        }

        const attachedEvent = this.event('onCardAttached', { attachment, target }, (event) => {
            const game = event.attachment.game;
            event.attachment.owner.removeCardFromPile(event.attachment);
            event.attachment.moveTo('play area', event.target);
            event.attachment.facedown = facedown;
            event.attachment.takeControl(player);
            event.target.attachments.push(event.attachment);

            game.queueSimpleStep(() => {
                event.attachment.applyPersistentEffects();
            });
            game.queueSimpleStep(() => {
                if (game.currentPhase !== 'setup' && event.attachment.isBestow()) {
                    game.queueStep(new BestowPrompt(game, player, event.attachment));
                }
            });
        });
        const events = [attachedEvent];

        if (originalLocation !== 'play area' && !facedown) {
            events.push(
                this.event('onCardEntersPlay', {
                    card: attachment,
                    playingType,
                    originalLocation
                })
            );
        }

        events.push(
            ...this.outOfShadowsEvents({ player, card: attachment, originalLocation, type: 'card' })
        );

        return this.atomic(...events);
    }

    outOfShadowsEvents({ player, card, originalLocation, type }) {
        if (originalLocation !== 'shadows') {
            return [];
        }

        return [this.event('onCardOutOfShadows', { player, card, type })];
    }
}

export default new Attach();
