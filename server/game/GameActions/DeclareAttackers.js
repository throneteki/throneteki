import GameAction from './GameAction.js';
import KneelCard from './KneelCard.js';

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
                const declareAsAttackerEvent = this.event('onDeclaredAsAttacker', {
                    card,
                    challenge: event.challenge
                });
                if (!card.kneeled && card.kneelsAsAttacker(event.challenge.challengeType)) {
                    event.thenAttachEvent(
                        this.atomic(declareAsAttackerEvent, KneelCard.createEvent({ card }))
                    );
                } else {
                    event.thenAttachEvent(declareAsAttackerEvent);
                }
            }
        });
    }

    canBeDeclaredAsAttacker(card, challenge) {
        let canKneelForChallenge =
            (!card.kneeled && !card.kneelsAsAttacker(challenge.challengeType)) ||
            KneelCard.allow({ card }) ||
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

export default new DeclareAttackers();
