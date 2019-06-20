const RevealCard = require('../../../server/game/GameActions/RevealCard');

describe('RevealCard', function() {
    beforeEach(function() {
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction']);
        // this.playerSpy = jasmine.createSpyObj('player', ['moveCard']);
        this.props = { card: this.cardSpy };
    });

    describe('allow()', function() {
        beforeEach(function() {
            this.cardSpy.location = 'play area';
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        for(let location of ['draw deck', 'hand', 'plot deck', 'shadows']) {
            describe(`when the card is in ${location}`, function() {
                beforeEach(function() {
                    this.cardSpy.location = location;
                });

                it('returns true', function() {
                    expect(RevealCard.allow(this.props)).toBe(true);
                });
            });
        }

        describe('when the card is not in a hidden area', function() {
            beforeEach(function() {
                this.cardSpy.location = 'play area';
            });

            it('returns false', function() {
                expect(RevealCard.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function() {
        beforeEach(function() {
            this.event = RevealCard.createEvent(this.props);
        });

        it('creates a onCardRevealed event', function() {
            expect(this.event.name).toBe('onCardRevealed');
            expect(this.event.card).toBe(this.cardSpy);
        });
    });
});
