import GameAction from './GameAction.js';
import MoveCardEventGenerator from './MoveCardEventGenerator.js';
import Message from '../Message.js';
import AttachmentPrompt from '../gamesteps/attachmentprompt.js';

class PutIntoPlay extends GameAction {
    constructor() {
        super('putIntoPlay');
    }

    message({ player, card, kneeled, context }) {
        player = player || card.controller;

        // Only show where the card came from if it is not already revealed
        let message =
            'puts {card} into play' +
            (kneeled ? ' knelt' : '') +
            (context.revealed && context.revealed.includes(card)
                ? ''
                : player === card.controller
                  ? ' from their {originalLocation}'
                  : " from {controller}'s {originalLocation} under their control");

        return Message.fragment(message, {
            card,
            controller: card.controller,
            originalLocation: card.location
        });
    }

    canChangeGameState({
        player,
        card,
        attachmentTargets,
        playingType = 'play',
        isEffectExpiration
    }) {
        player = player || card.controller;
        const targets = attachmentTargets || (() => true);
        return (
            card.location !== 'play area' &&
            player.canPutIntoPlay(card, playingType, { attachmentTargets, isEffectExpiration }) &&
            (playingType === 'setup' ||
                !!player.getDuplicateInPlay(card) ||
                card.getType() !== 'attachment' ||
                player.game.anyCardsInPlay((c) => player.canAttach(card, c) && targets(c)))
        );
    }

    createEvent({
        player,
        card,
        kneeled,
        playingType = 'play',
        attachmentTargets,
        dupeIsValid = false,
        xValue
    }) {
        player = player || card.controller;

        let dupeCard = player.getDuplicateInPlay(card);

        if (card.getPrintedType() === 'attachment' && playingType !== 'setup' && !dupeCard) {
            return this.event('__PLACEHOLDER_EVENT__', { player, card }, (event) => {
                event.player.game.queueStep(
                    new AttachmentPrompt(
                        event.player.game,
                        event.player,
                        event.card,
                        playingType,
                        attachmentTargets,
                        { kneeled, xValue }
                    )
                );
            });
        }

        const additionalEvents = [];
        if (card.location === 'shadows') {
            additionalEvents.push(
                this.event('onCardOutOfShadows', {
                    player,
                    card,
                    type: dupeCard ? 'dupe' : 'card',
                    xValue
                })
            );
        }

        if (dupeCard && playingType !== 'setup') {
            const isFullyResolved = (event) => dupeIsValid || event.card.location === 'play area';
            return this.atomic(
                this.event(
                    'onDupeEntersPlay',
                    { card, isFullyResolved, target: dupeCard },
                    (event) => {
                        event.card.controller.removeCardFromPile(event.card);
                        event.target.addDuplicate(event.card);
                    }
                ),
                ...additionalEvents
            );
        }

        let entersPlayEvent = MoveCardEventGenerator.createEntersPlayEvent({
            card,
            isDupe: !!dupeCard,
            kneeled,
            player,
            playingType
        });

        return this.atomic(entersPlayEvent, ...additionalEvents);
    }
}

export default new PutIntoPlay();
