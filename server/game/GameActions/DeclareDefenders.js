import GameAction from './GameAction.js';
import KneelCard from './KneelCard.js';

class DeclareDefenders extends GameAction {
    constructor() {
        super('declareDefenders');
    }

    createEvent({ cards, challenge }) {
        const eventParams = {
            cards,
            challenge,
            player: challenge.defendingPlayer,
            numOfDefendingCharacters: cards.length
        };
        return this.event('onDefendersDeclared', eventParams, (event) => {
            for (let card of event.cards) {
                const declareAsDefenderEvent = this.event('onDeclaredAsDefender', {
                    card,
                    challenge: event.challenge
                });
                if (!card.kneeled && card.kneelsAsDefender(event.challenge.challengeType)) {
                    event.thenAttachEvent(
                        this.atomic(declareAsDefenderEvent, KneelCard.createEvent({ card }))
                    );
                } else {
                    event.thenAttachEvent(declareAsDefenderEvent);
                }
            }
        });
    }
}

export default new DeclareDefenders();
