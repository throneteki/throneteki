const DiscardCard = require('../../../server/game/GameActions/DiscardCard');

describe('DiscardCard', function() {
    beforeEach(function() {
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction', 'createSnapshot']);
        this.playerSpy = jasmine.createSpyObj('player', ['moveCard']);
        this.props = { card: this.cardSpy, player: this.playerSpy };
    });

    describe('allow()', function() {
        beforeEach(function() {
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        for(let location of ['draw deck', 'hand', 'play area', 'shadows']) {
            describe(`when the card is in ${location}`, function() {
                beforeEach(function() {
                    this.cardSpy.location = location;
                });

                it('returns true', function() {
                    expect(DiscardCard.allow(this.props)).toBe(true);
                });
            });
        }

        describe('when the card is not in a discardable area', function() {
            beforeEach(function() {
                this.cardSpy.location = 'dead pile';
            });

            it('returns false', function() {
                expect(DiscardCard.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function() {
        beforeEach(function() {
            this.event = DiscardCard.createEvent(this.props);
        });

        it('creates a onCardDiscarded event', function() {
            expect(this.event.name).toBe('onCardDiscarded');
            expect(this.event.card).toBe(this.cardSpy);
            expect(this.event.player).toBe(this.playerSpy);
        });

        describe('the event handler', function() {
            beforeEach(function() {
                this.cardSpy.createSnapshot.and.returnValue('snapshot');
                this.event.executeHandler();
            });

            it('sets the card snapshot on the event', function() {
                expect(this.event.cardStateWhenDiscarded).toBe('snapshot');
            });

            it('moves the card to discard', function() {
                expect(this.playerSpy.moveCard).toHaveBeenCalledWith(this.cardSpy, 'discard pile');
            });
        });
    });
});
