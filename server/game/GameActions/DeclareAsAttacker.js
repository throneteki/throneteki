const GameAction = require('./GameAction');
const KneelCard = require('./KneelCard');

class DeclareAsAttacker extends GameAction {
    constructor() {
        super('declareAsAttacker');
    }

    canChangeGameState({ card, challenge }) {
        let canKneelForChallenge =
            !card.kneeled && !card.kneelsAsAttacker(challenge.challengeType) ||
            !card.kneeled && card.allowGameAction('kneel') ||
            card.kneeled && card.challengeOptions.contains('canBeDeclaredWhileKneeling');

        return (
            card.canParticipateInChallenge() &&
            card.location === 'play area' &&
            !card.stealth &&
            canKneelForChallenge &&
            (card.hasIcon(challenge.challengeType) || card.challengeOptions.contains('canBeDeclaredWithoutIcon'))
        );
    }

    createEvent({ card, challenge }) {
        let params = { card, challenge };
        return this.event('onDeclaredAsAttacker', params, event => {
            if(!event.card.kneeled && event.card.kneelsAsAttacker(challenge.challengeType)) {
                event.thenAttachEvent(KneelCard.createEvent({ card }));
            }
        });
    }
}

module.exports = new DeclareAsAttacker();
