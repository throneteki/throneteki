import DrawCards from '../../../server/game/GameActions/DrawCards.js';

describe('DrawCards', function () {
    beforeEach(function () {
        this.playerSpy = jasmine.createSpyObj('player', [
            'canDraw',
            'getNumCardsToDraw',
            'placeCardInPile'
        ]);
        this.playerSpy.getNumCardsToDraw.and.returnValue(1);
        this.playerSpy.drawDeck = ['card1', 'card2'];
        this.playerSpy.drawnCards = 0;
        this.props = { player: this.playerSpy, amount: 2 };
    });

    describe('allow()', function () {
        describe('when the player can draw cards', function () {
            beforeEach(function () {
                this.playerSpy.getNumCardsToDraw.and.returnValue(1);
            });

            it('returns true', function () {
                expect(DrawCards.allow(this.props)).toBe(true);
            });
        });

        describe('when the player cannot draw cards', function () {
            beforeEach(function () {
                this.playerSpy.getNumCardsToDraw.and.returnValue(0);
            });

            it('returns false', function () {
                expect(DrawCards.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.event = DrawCards.createEvent(this.props);
        });

        it('creates a onCardsDrawn event', function () {
            expect(this.event.name).toBe('onCardsDrawn');
            expect(this.event.player).toBe(this.playerSpy);
            // Default the reason to "ability"
            expect(this.event.reason).toBe('ability');
            // Do not set the card list until the draw actually resolves
            expect(this.event.cards).toEqual([]);
            // Amount should be the actual amount drawn, not the amount passed in
            expect(this.event.amount).toBe(1);
            // Desired amount should be the amount passed in
            expect(this.event.desiredAmount).toBe(2);
        });

        it('sets a length property for legacy purposes', function () {
            // A lot of current implementations check the current return value
            // (an array) for its length in order to print the number of cards
            // actually drawn. To start returning an event object from
            // Player#drawCardsToHand without changing all such implementations
            // requires that this property exist.
            expect(this.event.length).toBe(1);
        });

        it('passes through reason and source', function () {
            this.props.reason = 'reason';
            this.props.source = 'source';
            this.event = DrawCards.createEvent(this.props);

            expect(this.event.reason).toBe('reason');
            expect(this.event.source).toBe('source');
        });

        describe('the event handler', function () {
            beforeEach(function () {
                this.event.executeHandler();
                for (const attachedEvent of this.event.attachedEvents) {
                    attachedEvent.executeHandler();
                }
            });

            it('attaches individual drawn event', function () {
                expect(this.event.attachedEvents[0]).toEqual(
                    jasmine.objectContaining({
                        name: 'onCardDrawn',
                        card: 'card1'
                    })
                );
            });

            it('moves the appropriate number of cards', function () {
                expect(this.playerSpy.placeCardInPile).toHaveBeenCalledTimes(1);
                expect(this.playerSpy.placeCardInPile).toHaveBeenCalledWith({
                    card: 'card1',
                    location: 'hand'
                });
            });

            it('increments the number of drawn cards for the player', function () {
                expect(this.playerSpy.drawnCards).toBe(1);
            });

            it('adds the cards drawn to the event', function () {
                expect(this.event.cards).toEqual(['card1']);
            });
        });
    });
});
