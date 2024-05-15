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
                const defendEventParams = { card, challenge: event.challenge };
                event.thenAttachEvent(
                    this.event('onDeclaredAsDefender', defendEventParams, (defendEvent) => {
                        if (
                            !defendEvent.card.kneeled &&
                            defendEvent.card.kneelsAsDefender(defendEvent.challenge.challengeType)
                        ) {
                            defendEvent.thenAttachEvent(
                                KneelCard.createEvent({ card: defendEvent.card })
                            );
                        }
                    })
                );
            }
        });
    }
}

export default new DeclareDefenders();
