import GameAction from './GameAction.js';
import Message from '../Message.js';

class TakeControl extends GameAction {
    constructor() {
        super('takeControl');
    }

    message({ card }) {
        return Message.fragment('takes control of {card}', { card });
    }

    canChangeGameState({ player, card }) {
        if (!player || card.controller === player) {
            return false;
        }

        if (card.location !== 'play area') {
            return player.canPutIntoPlay(card);
        }

        return player.canControl(card);
    }

    createEvent({ player, card, context, source = context && context.source }) {
        return this.event(
            'onCardTakenControl',
            { card, oldController: card.controller, player, source },
            (event) => {
                event.card.takeControl(event.player, event.source);
                this.moveToController(event.card, event.oldController);
            }
        );
    }

    /**
     * Moves a card whose controller has changed into its new controller's area. Take-control
     * effects change the controller as they apply, then call this once the effects have settled.
     */
    applyControlChange(card, oldController, source) {
        if (card.controller === oldController) {
            return;
        }

        this.moveToController(card, oldController);
        card.game.raiseEvent('onCardTakenControl', {
            card,
            oldController,
            player: card.controller,
            source
        });
    }

    moveToController(card, oldController) {
        const game = card.game;

        if (!card.parent) {
            const pile = oldController.getSourceList(card.location);
            if (pile) {
                oldController.updateSourceList(
                    card.location,
                    pile.filter((other) => other !== card)
                );
            }
            card.controller.cardsInPlay.push(card);
        }

        if (card.location !== 'play area') {
            const originalLocation = card.location;
            card.moveTo('play area');
            card.applyPersistentEffects();
            game.raiseEvent('onCardEntersPlay', {
                card,
                playingType: 'play',
                originalLocation
            });
        }

        if (game.currentChallenge && game.currentChallenge.isParticipating(card)) {
            game.addMessage('{0} is removed from the challenge because control has changed', card);
            game.currentChallenge.removeFromChallenge(card);
        }
    }
}

export default new TakeControl();
