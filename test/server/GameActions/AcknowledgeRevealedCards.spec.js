import AcknowledgeRevealedCards from '../../../server/game/GameActions/AcknowledgeRevealedCards.js';

describe('acknowledging revealed cards', function () {
    it('is unavailable when no cards were revealed', function () {
        expect(AcknowledgeRevealedCards.allow({ revealed: [] })).toBe(false);
    });

    it('queues the acknowledgement prompt through its event', function () {
        const context = {
            revealed: [{}],
            revealingPlayer: {},
            source: {},
            game: { queueStep: vi.fn() }
        };
        expect(AcknowledgeRevealedCards.allow(context)).toBe(true);
        const event = AcknowledgeRevealedCards.createEvent(context);
        expect(context.game.queueStep).not.toHaveBeenCalled();
        event.executeHandler();
        expect(context.game.queueStep).toHaveBeenCalledOnce();
        expect(event.cards).toBe(context.revealed);
    });
});
