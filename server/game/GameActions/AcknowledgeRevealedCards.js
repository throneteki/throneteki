import GameAction from './GameAction.js';
import AcknowledgeRevealCardsPrompt from '../gamesteps/AcknowledgeRevealCardsPrompt.js';

class AcknowledgeRevealedCards extends GameAction {
    constructor() {
        super('acknowledgeRevealedCards');
    }

    allow(context) {
        return context.revealed.length > 0;
    }

    createEvent(context) {
        return this.event(
            'onRevealedCardsAcknowledged',
            {
                player: context.revealingPlayer,
                cards: context.revealed
            },
            () => {
                context.game.queueStep(
                    new AcknowledgeRevealCardsPrompt(
                        context.game,
                        context.revealed,
                        context.revealingPlayer,
                        context.source
                    )
                );
            }
        );
    }
}

export default new AcknowledgeRevealedCards();
