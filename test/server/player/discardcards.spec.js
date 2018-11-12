const Player = require('../../../server/game/player.js');

describe('Player', function() {
    function createCardSpy(num) {
        let spy = jasmine.createSpyObj('card', ['moveTo', 'removeDuplicate']);
        spy.num = num;
        spy.location = 'loc';
        spy.controller = jasmine.createSpyObj('player', ['moveCard']);
        return spy;
    }

    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['applyGameAction', 'raiseSimultaneousEvent']);
        this.gameSpy.applyGameAction.and.callFake((type, cards, handler) => {
            if(cards.length > 0) {
                handler(cards);
            }
        });
        this.gameSpy.raiseSimultaneousEvent.and.callFake((cards, params) => {
            this.handler = params.handler;
            this.postHandler = params.postHandler;
            this.perCardHandler = params.perCardHandler;
        });

        this.player = new Player('1', { username: 'Test 1', settings: {} }, true, this.gameSpy);

        this.callbackSpy = jasmine.createSpy('callback');

        this.card1 = createCardSpy(1);
        this.card2 = createCardSpy(2);
    });

    describe('discardCards()', function() {
        describe('when no cards are passed', function() {
            beforeEach(function() {
                this.player.discardCards([], false, this.callbackSpy);
            });

            it('should not raise the event', function() {
                expect(this.gameSpy.raiseSimultaneousEvent).not.toHaveBeenCalled();
            });
        });

        describe('when cards are passed', function() {
            beforeEach(function() {
                this.player.discardCards([this.card1, this.card2], false, this.callbackSpy);
            });

            it('should raise the onCardsDiscarded event', function() {
                expect(this.gameSpy.raiseSimultaneousEvent).toHaveBeenCalledWith([this.card1, this.card2], jasmine.objectContaining({
                    eventName: 'onCardsDiscarded',
                    postHandler: jasmine.any(Function),
                    perCardEventName: 'onCardDiscarded',
                    perCardHandler: jasmine.any(Function),
                    params: jasmine.objectContaining({
                        allowSave: false,
                        automaticSaveWithDupe: true,
                        originalLocation: 'loc'
                    })
                }));
            });

            describe('the perCardHandler', function() {
                beforeEach(function() {
                    this.perCardHandler({ card: this.card1 });
                });

                it('should move the card to the discard pile', function() {
                    expect(this.card1.controller.moveCard).toHaveBeenCalledWith(this.card1, 'discard pile');
                });
            });

            describe('the postHandler', function() {
                beforeEach(function() {
                    this.postHandler({ cards: [this.card1, this.card2] });
                });

                it('should call the callback with the appropriate cards', function() {
                    expect(this.callbackSpy).toHaveBeenCalledWith([this.card1, this.card2]);
                });
            });
        });
    });

    describe('discardCard()', function() {
        beforeEach(function() {
            this.player.discardCard(this.card1, false);
        });

        it('should raise the onCardsDiscarded event', function() {
            expect(this.gameSpy.raiseSimultaneousEvent).toHaveBeenCalledWith([this.card1], jasmine.objectContaining({ eventName: 'onCardsDiscarded' }));
        });
    });
});
