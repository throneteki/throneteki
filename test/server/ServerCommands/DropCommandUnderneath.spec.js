import DropCommand from '../../../server/game/ServerCommands/DropCommand.js';

describe('DropCommand placing a card underneath another', function () {
    beforeEach(function () {
        this.gameSpy = {
            addAlert: vi.fn(),
            resolveGameAction: vi.fn(),
            manualActions: { record: vi.fn() }
        };
        this.playerSpy = { moveCard: vi.fn() };
        this.cardSpy = { getType: vi.fn().mockReturnValue('character'), location: 'hand' };
        this.cardSpy.controller = this.cardSpy.owner = this.playerSpy;
        this.parentSpy = { location: 'play area', underneath: [] };

        this.drop = (parent = this.parentSpy) => {
            this.command = new DropCommand(
                this.gameSpy,
                this.playerSpy,
                this.cardSpy,
                'underneath',
                parent
            );
            this.result = this.command.execute();
            this.action = this.gameSpy.resolveGameAction.mock.calls[0]?.[0];
        };
    });

    it('places a card from hand facedown underneath a card in play', function () {
        this.drop();

        expect(this.result).toBe(true);
        expect(this.action.action.name).toBe('placeCardUnderneath');
        expect(this.action.resolveProperties({})).toEqual(
            expect.objectContaining({
                card: this.cardSpy,
                parentCard: this.parentSpy,
                player: this.playerSpy,
                facedown: true
            })
        );
        expect(this.playerSpy.moveCard).not.toHaveBeenCalled();
    });

    it('names a card that comes from a pile everyone can see', function () {
        this.cardSpy.location = 'discard pile';
        this.drop();

        expect(this.gameSpy.addAlert).toHaveBeenCalledWith(
            'danger',
            expect.any(String),
            this.playerSpy,
            this.cardSpy,
            'discard pile',
            this.parentSpy
        );
    });

    it('does not name a card that comes from hand', function () {
        this.drop();

        expect(this.gameSpy.addAlert).toHaveBeenCalledWith(
            'danger',
            expect.any(String),
            this.playerSpy,
            'a card',
            'hand',
            this.parentSpy
        );
    });

    it('places a card in play underneath another card in play', function () {
        this.cardSpy.location = 'play area';
        this.drop();

        expect(this.result).toBe(true);
        expect(this.gameSpy.resolveGameAction).toHaveBeenCalledTimes(1);
    });

    it('moves a card from underneath one card to underneath another', function () {
        this.cardSpy.location = 'underneath';
        this.drop();

        expect(this.result).toBe(true);
        expect(this.gameSpy.resolveGameAction).toHaveBeenCalledTimes(1);
    });

    it('does nothing with an attachment that is waiting for its target', function () {
        this.gameSpy.pendingAttachments = new Set([this.cardSpy]);
        this.drop();

        expect(this.result).toBe(false);
        expect(this.gameSpy.resolveGameAction).not.toHaveBeenCalled();
    });

    for (const [scenario, change] of [
        ['there is no card to place it under', (test) => (test.parent = null)],
        ['the card would go under itself', (test) => (test.parent = test.cardSpy)],
        [
            'the card it goes under is not in play',
            (test) => (test.parentSpy.location = 'discard pile')
        ],
        [
            'the card it goes under is attached to it',
            (test) => (test.parentSpy.parent = test.cardSpy)
        ],
        ['the card is a plot', (test) => test.cardSpy.getType.mockReturnValue('plot')],
        ['the card is controlled by someone else', (test) => (test.cardSpy.controller = {})],
        [
            'the card is already underneath that card',
            (test) => test.parentSpy.underneath.push(test.cardSpy)
        ]
    ]) {
        it(`does nothing when ${scenario}`, function () {
            this.parent = this.parentSpy;
            change(this);
            this.drop(this.parent);

            expect(this.result).toBe(false);
            expect(this.gameSpy.resolveGameAction).not.toHaveBeenCalled();
            expect(this.gameSpy.addAlert).not.toHaveBeenCalled();
        });
    }
});
