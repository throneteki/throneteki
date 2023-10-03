const GameAction = require('./GameAction');
const Message = require('../Message');

class AddToChallenge extends GameAction {
    constructor() {
        super('addToChallenge');
    }

    message({ card, player, context }) {
        player = player || card.controller;
        const playerMessage = player === context.player ? 'their' : Message.fragment('{player}\'s', { player });
        return Message.fragment('has {card} participate in the challenge on {player} side', { card, player: playerMessage });
    }

    canChangeGameState({ card }) {
        return !card.isParticipating();
    }

    createEvent({ card, player }) {
        const challenge = card.game.currentChallenge;
        player = player || card.controller;
        const eventProps = {
            card,
            challenge,
            player
        };
        return this.event('onAddedToChallenge', eventProps, event => {
            event.challenge.addParticipantToSide(event.player, event.card);
        });
    }
}

module.exports = new AddToChallenge();
