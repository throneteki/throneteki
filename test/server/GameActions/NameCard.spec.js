import NameCard from '../../../server/game/GameActions/NameCard.js';

describe('NameCard', function () {
    beforeEach(function () {
        this.player = {};
        this.context = {
            player: this.player,
            source: {},
            game: {
                cardData: {
                    event: { name: 'An Event', type: 'event' },
                    character: { name: 'A Character', type: 'character' }
                },
                promptWithMenu: vi.fn()
            }
        };
        this.prompt = (properties = {}) => {
            const action = new NameCard(properties);
            this.event = action.createEvent(this.context);
            this.event.executeHandler();
            return this.context.game.promptWithMenu.mock.calls.at(-1)[1].selectCardName;
        };
    });

    it('accepts any real card by default, including a differently capitalized title', function () {
        const select = this.prompt();
        expect(select(this.player, 'a character')).toBe(true);
        expect(this.context.namedCard).toBe('a character');
        expect(this.event.cardName).toBe('a character');
    });

    it('rejects unknown titles without updating the context or resolving the follow-up', function () {
        const gameAction = { allow: vi.fn(), createEvent: vi.fn() };
        const select = this.prompt({ gameAction });
        expect(select(this.player, 'Unknown')).toBe(false);
        expect(this.context.namedCard).toBeUndefined();
        expect(gameAction.allow).not.toHaveBeenCalled();
    });

    it('enforces the match predicate with card data and the ability context', function () {
        const match = vi.fn((card) => card.type === 'event');
        const select = this.prompt({ match });
        expect(select(this.player, 'A Character')).toBe(false);
        expect(this.context.namedCard).toBeUndefined();
        expect(select(this.player, 'AN EVENT')).toBe(true);
        expect(match).toHaveBeenCalledWith(this.context.game.cardData.event, this.context);
    });

    it('resolves the follow-up only after a permitted name is selected', function () {
        const child = {};
        const gameAction = { allow: vi.fn(() => true), createEvent: vi.fn(() => child) };
        const select = this.prompt({ match: (card) => card.type === 'event', gameAction });
        const attach = vi.spyOn(this.event, 'thenAttachEvent').mockImplementation(() => {});
        expect(select(this.player, 'A Character')).toBe(false);
        expect(gameAction.allow).not.toHaveBeenCalled();
        expect(select(this.player, 'An Event')).toBe(true);
        expect(gameAction.createEvent).toHaveBeenCalledWith(this.context);
        expect(attach).toHaveBeenCalledWith(child);
    });

    it('can remember a valid name on the source for later abilities', function () {
        const select = this.prompt({ remember: true });
        expect(select(this.player, 'Unknown')).toBe(false);
        expect(this.context.source.namedCard).toBeUndefined();
        expect(select(this.player, 'A Character')).toBe(true);
        expect(this.context.source.namedCard).toBe('A Character');
    });

    it('leaves the source name unchanged unless remembering is requested', function () {
        const select = this.prompt();
        select(this.player, 'A Character');
        expect(this.context.source.namedCard).toBeUndefined();
    });
});
