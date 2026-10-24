import NameFaction from '../../../server/game/GameActions/NameFaction.js';

describe('NameFaction', function () {
    beforeEach(function () {
        this.context = {
            player: {},
            source: {},
            game: { promptWithMenu: vi.fn(), addMessage: vi.fn() }
        };
    });

    it('requires distinct real factions and records the completed choice on the source', function () {
        const action = new NameFaction({ count: 2 });
        const event = action.createEvent(this.context);
        event.executeHandler();
        const select = this.context.game.promptWithMenu.mock.calls[0][1].selectFaction;
        expect(select(this.context.player, 'neutral')).toBe(false);
        expect(select(this.context.player, 'unknown')).toBe(false);
        expect(select(this.context.player, 'stark')).toBe(false);
        expect(this.context.source.namedFactions).toBeUndefined();
        expect(select(this.context.player, 'stark')).toBe(false);
        expect(select(this.context.player, 'martell')).toBe(true);
        expect(this.context.source.namedFactions).toEqual(['stark', 'martell']);
        expect(event.factions).toEqual(['stark', 'martell']);
    });

    it('finishes immediately after naming the single required faction', function () {
        const event = new NameFaction().createEvent(this.context);
        event.executeHandler();
        const select = this.context.game.promptWithMenu.mock.calls[0][1].selectFaction;
        expect(select(this.context.player, 'greyjoy')).toBe(true);
        expect(this.context.source.namedFactions).toEqual(['greyjoy']);
    });
});
