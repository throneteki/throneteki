import Player from '../../../server/game/player.js';

describe('Player', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['drop']);

        this.player = new Player('1', { username: 'Test 1', settings: {} }, true, this.gameSpy);

        this.reducerSpy = jasmine.createSpyObj('reducer', [
            'canReduce',
            'getAmount',
            'markUsed',
            'isExpired',
            'unregisterEvents'
        ]);
        this.reducerSpy.getAmount.and.returnValue(1);
        this.reducer2Spy = jasmine.createSpyObj('reducer2', [
            'canReduce',
            'getAmount',
            'markUsed',
            'isExpired',
            'unregisterEvents'
        ]);
        this.cardSpy = jasmine.createSpyObj('card', ['getCost', 'getMinCost', 'getAmbushCost']);
    });

    describe('markUsedReducers()', function () {
        beforeEach(function () {
            this.player.addCostReducer(this.reducerSpy);
            this.player.addCostReducer(this.reducer2Spy);
            this.reducerSpy.canReduce.and.returnValue(true);
            this.player.markUsedReducers('marshal', this.cardSpy);
        });

        it('should check that the reducers are eligible', function () {
            expect(this.reducerSpy.canReduce).toHaveBeenCalledWith('marshal', this.cardSpy);
            expect(this.reducer2Spy.canReduce).toHaveBeenCalledWith('marshal', this.cardSpy);
        });

        it('should mark the eligible reducers as used', function () {
            expect(this.reducerSpy.markUsed).toHaveBeenCalled();
            expect(this.reducer2Spy.markUsed).not.toHaveBeenCalled();
        });

        describe('when marking the reducer as used causes it to expire', function () {
            beforeEach(function () {
                this.reducerSpy.markUsed.and.callFake(() => {
                    this.reducerSpy.isExpired.and.returnValue(true);
                });
                this.player.markUsedReducers('marshal', this.cardSpy);
            });

            it('should remove the expired reducer from the list', function () {
                expect(this.player.costReducers).toEqual([this.reducer2Spy]);
            });

            it('should unregister events for the expired reducer', function () {
                expect(this.reducerSpy.unregisterEvents).toHaveBeenCalled();
                expect(this.reducer2Spy.unregisterEvents).not.toHaveBeenCalled();
            });
        });
    });
});
