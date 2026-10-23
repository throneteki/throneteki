import GameAction from './GameAction.js';
import Message from '../Message.js';
import BestowPrompt from '../gamesteps/bestowprompt.js';
import Effects from '../effects.js';

class Attach extends GameAction {
    constructor() {
        super('attach');
    }

    message({ attachment, target }) {
        return Message.fragment('attaches {attachment} to {target}', { attachment, target });
    }

    canChangeGameState({ player, attachment, target, facedown = false, asAttachment }) {
        if (!attachment) {
            return false;
        }

        player = player || attachment.controller;
        return (
            !!target &&
            target.location === 'play area' &&
            attachment.parent !== target &&
            (facedown || player.canAttach(this.asAttached(attachment, asAttachment), target))
        );
    }

    // Whether a card that becomes an attachment can be attached depends on what it will be once
    // attached, not on its printed type.
    asAttached(attachment, asAttachment) {
        if (!asAttachment) {
            return attachment;
        }

        const candidate = attachment.createSnapshot();
        candidate.setCardType('attachment');
        for (const keyword of asAttachment.keywords || []) {
            candidate.addKeyword(keyword);
        }
        for (const trait of asAttachment.traits || []) {
            candidate.addTrait(trait);
        }
        return candidate;
    }

    createEvent({
        player,
        attachment,
        target,
        playingType = 'play',
        facedown = false,
        asAttachment,
        context
    }) {
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

            if (asAttachment) {
                this.applyAttachmentText(
                    (context && context.source) || event.attachment,
                    event.attachment,
                    asAttachment
                );
            }

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

    // A card attached "as an attachment with the text: ..." gets that text from the effect that
    // attached it, so blanking the attachment doesn't remove it.
    applyAttachmentText(source, card, { keywords = [], traits = [], effect }) {
        const until = { onCardLeftPlay: (event) => event.card === card };
        card.game.addEffect(source, {
            duration: 'custom',
            until,
            location: 'any',
            targetLocation: 'any',
            condition: () => !!card.parent,
            match: card,
            effect: [
                Effects.setCardType('attachment'),
                ...keywords.map((keyword) => Effects.addKeyword(keyword)),
                ...traits.map((trait) => Effects.addTrait(trait))
            ]
        });

        if (effect) {
            card.game.addEffect(source, {
                duration: 'custom',
                until,
                location: 'any',
                targetLocation: 'any',
                targetController: 'any',
                condition: () => card.location === 'play area',
                match: (parent) => parent === card.parent,
                effect
            });
        }
    }

    outOfShadowsEvents({ player, card, originalLocation, type }) {
        if (originalLocation !== 'shadows') {
            return [];
        }

        return [this.event('onCardOutOfShadows', { player, card, type })];
    }
}

export default new Attach();
