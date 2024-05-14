const GameAction = require('./GameAction');
const KneelCard = require('./KneelCard');

class DeclareAttackers extends GameAction {
    constructor() {
        super('declareAttackers');
    }

    canChangeGameState({ cards, challenge }) {
        return cards.some((card) => this.canBeDeclaredAsAttacker(card, challenge));
    }

    createEvent({ cards, challenge }) {
        cards = cards.filter((card) => this.canBeDeclaredAsAttacker(card, challenge));
        const eventParams = {
            cards,
            challenge,
            player: challenge.attackingPlayer,
            numOfAttackingCharacters: cards.length
        };
        return this.event('onAttackersDeclared', eventParams, (event) => {
            for (let card of event.cards) {
                const attackEventParams = { card, challenge: event.challenge };
                event.thenAttachEvent(
                    this.event('onDeclaredAsAttacker', attackEventParams, (attackEvent) => {
                        if (
                            !attackEvent.card.kneeled &&
                            attackEvent.card.kneelsAsAttacker(attackEvent.challenge.challengeType)
                        ) {
                            attackEvent.thenAttachEvent(
                                KneelCard.createEvent({ card: attackEvent.card })
                            );
                        }
                    })
                );
            }
        });
    }

    canBeDeclaredAsAttacker(card, challenge) {
        let canKneelForChallenge =
            (!card.kneeled && !card.kneelsAsAttacker(challenge.challengeType)) ||
            (!card.kneeled && card.allowGameAction('kneel')) ||
            (card.kneeled && card.challengeOptions.contains('canBeDeclaredWhileKneeling'));

        return (
            card.canParticipateInChallenge() &&
            card.location === 'play area' &&
            canKneelForChallenge &&
            (card.hasIcon(challenge.challengeType) ||
                card.challengeOptions.contains('canBeDeclaredWithoutIcon'))
        );
    }
}

module.exports = new DeclareAttackers();
