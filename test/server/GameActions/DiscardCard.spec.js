import DiscardCard from '../../../server/game/GameActions/DiscardCard.js';

describe('DiscardCard', function () {
    beforeEach(function () {
        this.playerSpy = {};
        this.cardSpy = { allowGameAction: vi.fn(), createSnapshot: vi.fn() };
        this.cardSpy.controller = this.playerSpy;
        this.props = { card: this.cardSpy };
    });

    describe('allow()', function () {
        beforeEach(function () {
            this.cardSpy.allowGameAction.mockReturnValue(true);
        });

        for (let location of ['draw deck', 'hand', 'play area', 'shadows', 'duplicate']) {
            describe(`when the card is in ${location}`, function () {
                beforeEach(function () {
                    this.cardSpy.location = location;
                });

                it('returns true', function () {
                    expect(DiscardCard.allow(this.props)).toBe(true);
                });
            });
        }

        describe('when the card is not in a discardable area', function () {
            beforeEach(function () {
                this.cardSpy.location = 'dead pile';
            });

            it('returns false', function () {
                expect(DiscardCard.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.cardSpy.createSnapshot.mockReturnValue('snapshot');
            this.event = DiscardCard.createEvent(this.props);
        });

        it('creates a onCardDiscarded event', function () {
            expect(this.event.name).toBe('onCardDiscarded');
            expect(this.event.card).toBe(this.cardSpy);
        });

        describe('the event handler', function () {
            beforeEach(function () {
                this.event.executeHandler();
            });

            it('sets the card snapshot on the event', function () {
                expect(this.event.cardStateWhenDiscarded).toBe('snapshot');
            });

            it('places the card in the discard pile', function () {
                const placeEvent = this.event.attachedEvents[0];
                expect(placeEvent.name).toBe('onCardPlaced');
                expect(placeEvent.card).toBe(this.cardSpy);
                expect(placeEvent.player).toBe(this.playerSpy);
                expect(placeEvent.location).toBe('discard pile');
            });
        });
    });

    describe('discarding a character directly to the dead pile', function () {
        beforeEach(function () {
            this.cardSpy.location = 'hand';
            this.cardSpy.getType = () => 'character';
            this.cardSpy.allowGameAction.mockReturnValue(true);
        });

        it('allows a character destination while rejecting other card types and destinations', function () {
            expect(DiscardCard.allow({ ...this.props, destination: 'dead pile' })).toBe(true);
            this.cardSpy.getType = () => 'location';
            expect(DiscardCard.allow({ ...this.props, destination: 'dead pile' })).toBe(false);
            expect(DiscardCard.allow({ ...this.props, destination: 'hand' })).toBe(false);
        });

        it('remains a discard event with its original location and discard flags', function () {
            const event = DiscardCard.createEvent({
                ...this.props,
                destination: 'dead pile',
                allowSave: false,
                isRandom: true
            });
            expect(event.name).toBe('onCardDiscarded');
            expect(event.originalLocation).toBe('hand');
            expect(event.isRandom).toBe(true);
            expect(event.allowSave).toBe(false);
            event.executeHandler();
            expect(event.attachedEvents[0].name).toBe('onCardPlaced');
            expect(event.attachedEvents[0].location).toBe('dead pile');
            expect(event.attachedEvents[0].card).toBe(this.cardSpy);
        });
    });
});
