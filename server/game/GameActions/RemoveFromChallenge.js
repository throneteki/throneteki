const GameAction = require('./GameAction');
const Message = require('../Message');

class RemoveFromChallenge extends GameAction {
    constructor() {
        super('removeFromChallenge');
    }

    message({ card }) {
        return Message.fragment('removes {card} from the challenge', { card });
    }

    canChangeGameState({ card }) {
        return card.isParticipating();
    }

    createEvent({ card }) {
        const challenge = card.game.currentChallenge;
        const eventProps = {
            card,
            challenge: challenge,
            isAttacking: challenge.isAttacking(card),
            isDeclared: challenge.isDeclared(card),
            isDefending: challenge.isDefending(card)
        };
        return this.event('onRemovedFromChallenge', eventProps, event => {
            event.challenge.attackers = event.challenge.attackers.filter(c => c !== event.card);
            event.challenge.declaredAttackers = event.challenge.declaredAttackers.filter(c => c !== event.card);
            event.challenge.defenders = event.challenge.defenders.filter(c => c !== event.card);
    
            event.card.inChallenge = false;
    
            event.challenge.challengeContributions.removeParticipants([event.card]);

            event.challenge.calculateStrength();
        });
    }
}

module.exports = new RemoveFromChallenge();
