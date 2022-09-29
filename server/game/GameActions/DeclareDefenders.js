const GameAction = require('./GameAction');
const KneelCard = require('./KneelCard');

class DeclareDefenders extends GameAction {
    constructor() {
        super('declareDefenders');
    }

    canChangeGameState({ cards, challenge }) {
        return cards.some(card => {
            let canKneelForChallenge =
                !card.kneeled && !card.kneelsAsDefender(challenge.challengeType) ||
                !card.kneeled && card.allowGameAction('kneel') ||
                card.kneeled && card.challengeOptions.contains('canBeDeclaredWhileKneeling');
    
            return (
                card.canParticipateInChallenge() &&
                card.location === 'play area' &&
                !card.stealth &&
                canKneelForChallenge &&
                (card.hasIcon(challenge.challengeType) || card.challengeOptions.contains('canBeDeclaredWithoutIcon'))
            );
        });
    }

    createEvent({ cards, challenge }) {
        const eventParams = {
            cards,
            challenge,
            player: challenge.defendingPlayer,
            numOfDefendingCharacters: cards.length
        };
        return this.event('onDefendersDeclared', eventParams, event => {
            for(let card of event.cards) {
                const defendEventParams = { card, challenge };
                event.thenAttachEvent(this.event('onDeclaredAsDefender', defendEventParams, defendEvent => {
                    if(!defendEvent.card.kneeled && defendEvent.card.kneelsAsDefender(defendEvent.challenge.challengeType)) {
                        defendEvent.thenAttachEvent(KneelCard.createEvent({ card: defendEvent.card }));
                    }
                }));
            }
        });
    }
}

module.exports = new DeclareDefenders();
