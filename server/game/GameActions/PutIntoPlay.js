const GameAction = require('./GameAction');
const MoveCardEventGenerator = require('./MoveCardEventGenerator');
const Message = require('../Message');

class PutIntoPlay extends GameAction {
    constructor() {
        super('putIntoPlay');
    }

    message({ player, card, kneeled, context }) {
        player = player || card.controller;

        // Only show where the card came from if it is not already revealed
        let message = 'puts {card} into play'
            + (kneeled ? ' knelt' : '')
            + (context.revealed && context.revealed.includes(card) ? '' : (player === card.controller ? ' from their {originalLocation}' : ' from {controller}\'s {originalLocation} under their control'));

        return Message.fragment(message, { card, controller: card.controller, originalLocation: card.location });
    }

    canChangeGameState({ player, card }) {
        player = player || card.controller;
        return card.location !== 'play area' && player.canPutIntoPlay(card);
    }

    createEvent({ player, card, kneeled, playingType, attachmentTargets }) {
        player = player || card.controller;

        let dupeCard = player.getDuplicateInPlay(card);

        if(card.getPrintedType() === 'attachment' && playingType !== 'setup' && !dupeCard) {
            return this.event('__PLACEHOLDER_EVENT__', { player, card }, event => {
                event.player.putIntoPlay(event.card, 'play', { kneeled, attachmentTargets });
            });
        }

        const additionalEvents = [];
        if(card.location === 'shadows') {
            additionalEvents.push(this.event('onCardOutOfShadows', { player, card, type: dupeCard ? 'dupe' : 'card' }));
        }

        if(dupeCard && playingType !== 'setup') {
            const isFullyResolved = event => event.card.location === 'play area';
            return this.atomic(
                this.event('onDupeEntersPlay', { card, isFullyResolved, target: dupeCard }, event => {
                    event.card.controller.removeCardFromPile(event.card);
                    event.target.addDuplicate(event.card);
                }),
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

        return this.atomic(
            entersPlayEvent,
            ...additionalEvents
        );
    }
}

module.exports = new PutIntoPlay();
