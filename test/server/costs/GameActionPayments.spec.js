import RemoveFromGameCost from '../../../server/game/costs/RemoveFromGameCost.js';
import PlaceInDeadPileFromHandCost from '../../../server/game/costs/PlaceInDeadPileFromHandCost.js';
import Costs from '../../../server/game/costs.js';

describe('game action cost payments', function () {
    beforeEach(function () {
        this.card = {
            location: 'hand',
            tokens: { gold: 3 },
            controller: {},
            owner: {},
            allowGameAction: () => true,
            hasToken: (token) => !!this.card.tokens[token]
        };
        this.context = {
            source: this.card,
            player: this.card.controller,
            xValue: 2,
            game: { resolveGameAction: vi.fn() }
        };
    });

    it('removes a card through an unsaveable removal event', function () {
        new RemoveFromGameCost().pay([this.card], this.context);
        const [action, context] = this.context.game.resolveGameAction.mock.calls[0];
        const event = action.createEvent(context).childEvents[0];
        expect(event.name).toBe('onCardRemovedFromGame');
        expect(event.card).toBe(this.card);
        expect(event.allowSave).toBe(false);
    });

    it('places a card from hand in its dead pile without killing or discarding it', function () {
        new PlaceInDeadPileFromHandCost().pay([this.card], this.context);
        const [action, context] = this.context.game.resolveGameAction.mock.calls[0];
        const event = action.createEvent(context).childEvents[0];
        expect(event.name).toBe('onCardPlaced');
        expect(event.card).toBe(this.card);
        expect(event.location).toBe('dead pile');
    });

    it('discards X gold through an event that participates in cost prevention', function () {
        Costs.discardXGold(
            () => 0,
            () => 3
        ).pay(this.context);
        const [action, context] = this.context.game.resolveGameAction.mock.calls[0];
        const event = action.createEvent(context);
        expect(event.name).toBe('onTokenDiscarded');
        expect(event.card).toBe(this.card);
        expect(event.amount).toBe(2);
        expect(event.token).toBe('gold');
        expect(this.card.tokens.gold).toBe(3);
    });

    it('allows paying zero gold from a card without gold tokens', function () {
        this.card.tokens = {};
        expect(
            Costs.discardXGold(
                () => 0,
                () => 3
            ).canPay(this.context)
        ).toBe(true);
    });
});
