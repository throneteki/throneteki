import CostReducer from '../../server/game/costreducer.js';

describe('CostReducer', function () {
    beforeEach(function () {
        this.gameSpy = { on: vi.fn(), removeListener: vi.fn() };
        this.source = {};
        this.limitSpy = {
            increment: vi.fn(),
            isAtMax: vi.fn(),
            isRepeatable: vi.fn(),
            registerEvents: vi.fn(),
            unregisterEvents: vi.fn()
        };
        this.properties = {
            match: vi.fn()
        };
    });

    describe('constructor', function () {
        describe('defaults', function () {
            beforeEach(function () {
                this.properties.limit = null;
                this.reducer = new CostReducer(this.gameSpy, this.source, this.properties);
            });

            it('should default the amount to 1', function () {
                expect(this.reducer.amount).toBe(1);
            });

            it('should default to no users', function () {
                expect(this.reducer.uses).toBe(0);
            });
        });

        it('should register events for the limit if provided', function () {
            this.properties.limit = this.limitSpy;
            this.reducer = new CostReducer(this.gameSpy, this.source, this.properties);
            expect(this.limitSpy.registerEvents).toHaveBeenCalledWith(this.gameSpy);
        });

        describe('when playingTypes is not an array', function () {
            beforeEach(function () {
                this.properties.playingTypes = 'marshal';
                this.reducer = new CostReducer(this.gameSpy, this.source, this.properties);
            });

            it('should wrap it in an array', function () {
                expect(this.reducer.playingTypes).toEqual(['marshal']);
            });
        });
    });

    describe('canReduce()', function () {
        beforeEach(function () {
            this.card = {};
            this.properties.match.mockReturnValue(true);
            this.properties.playingTypes = ['marshal', 'ambush'];
            this.properties.limit = this.limitSpy;
            this.limitSpy.isAtMax.mockReturnValue(false);
            this.reducer = new CostReducer(this.gameSpy, this.source, this.properties);
        });

        describe('when below the limit, with correct play type, and the card matches', function () {
            it('should return true', function () {
                expect(this.reducer.canReduce('marshal', this.card)).toBe(true);
            });
        });

        describe('when the limit has been reached', function () {
            beforeEach(function () {
                this.limitSpy.isAtMax.mockReturnValue(true);
            });

            it('should return false', function () {
                expect(this.reducer.canReduce('marshal', this.card)).toBe(false);
            });
        });

        describe('when the play type does not match', function () {
            it('should return false', function () {
                expect(this.reducer.canReduce('foobar', this.card)).toBe(false);
            });
        });

        describe('when the card fails the match function', function () {
            beforeEach(function () {
                this.properties.match.mockReturnValue(false);
            });

            it('should return false', function () {
                expect(this.reducer.canReduce('marshal', this.card)).toBe(false);
            });
        });

        describe('when reducing out of shadows and playing an event out of shadow', function () {
            beforeEach(function () {
                this.reducer = new CostReducer(this.gameSpy, this.source, {
                    playingTypes: 'outOfShadows'
                });
                this.card.location = 'shadows';
            });

            it('should return true', function () {
                expect(this.reducer.canReduce('play', this.card)).toBe(true);
            });
        });
    });

    describe('markUsed()', function () {
        beforeEach(function () {
            this.reducer = new CostReducer(this.gameSpy, this.source, this.properties);
        });

        describe('when there is no limit', function () {
            beforeEach(function () {
                this.reducer.limit = null;
            });

            it('should not crash', function () {
                expect(() => this.reducer.markUsed()).not.toThrow();
            });
        });

        describe('when there is a limit', function () {
            beforeEach(function () {
                this.reducer.limit = this.limitSpy;
            });

            it('should increment the limit', function () {
                this.reducer.markUsed();
                expect(this.limitSpy.increment).toHaveBeenCalled();
            });
        });
    });

    describe('isExpired()', function () {
        beforeEach(function () {
            this.reducer = new CostReducer(this.gameSpy, this.source, this.properties);
        });

        describe('when there is no limit', function () {
            beforeEach(function () {
                this.reducer.limit = null;
            });

            it('should return false', function () {
                expect(this.reducer.isExpired()).toBe(false);
            });
        });

        describe('when there is a limit', function () {
            beforeEach(function () {
                this.reducer.limit = this.limitSpy;
            });

            describe('and the limit is not repeatable', function () {
                beforeEach(function () {
                    this.limitSpy.isRepeatable.mockReturnValue(false);
                });

                it('should return false when below the limit', function () {
                    this.limitSpy.isAtMax.mockReturnValue(false);
                    expect(this.reducer.isExpired()).toBe(false);
                });

                it('should return true when the limit has been reached', function () {
                    this.limitSpy.isAtMax.mockReturnValue(true);
                    expect(this.reducer.isExpired()).toBe(true);
                });
            });

            describe('and the limit is repeatable', function () {
                beforeEach(function () {
                    this.limitSpy.isRepeatable.mockReturnValue(true);
                });

                it('should return false when below the limit', function () {
                    this.limitSpy.isAtMax.mockReturnValue(false);
                    expect(this.reducer.isExpired()).toBe(false);
                });

                it('should return false even when the limit has been reached', function () {
                    this.limitSpy.isAtMax.mockReturnValue(true);
                    expect(this.reducer.isExpired()).toBe(false);
                });
            });
        });
    });

    describe('unregisterEvents()', function () {
        beforeEach(function () {
            this.reducer = new CostReducer(this.gameSpy, this.source, this.properties);
        });

        describe('when there is no limit', function () {
            beforeEach(function () {
                this.reducer.limit = null;
            });

            it('should not crash', function () {
                expect(() => this.reducer.unregisterEvents()).not.toThrow();
            });
        });

        describe('when there is a limit', function () {
            beforeEach(function () {
                this.reducer.limit = this.limitSpy;
            });

            it('should unregister events on the limit', function () {
                this.reducer.unregisterEvents();
                expect(this.limitSpy.unregisterEvents).toHaveBeenCalledWith(this.gameSpy);
            });
        });
    });
});
