const AbilityTarget = require('../../server/game/AbilityTarget.js');

describe('AbilityTarget', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'promptForSelect']);
        this.card1 = jasmine.createSpyObj('card', ['allowGameAction', 'getType']);
        this.card1.allowGameAction.and.returnValue(true);
        this.card1.getType.and.returnValue('character');
        this.card2 = jasmine.createSpyObj('card', ['allowGameAction', 'getType']);
        this.card2.allowGameAction.and.returnValue(true);
        this.card2.getType.and.returnValue('location');
        this.gameSpy.allCards = [this.card1, this.card2];
        this.player = { player: 1 };
        this.source = { source: 1 };

        this.context = { game: this.gameSpy, player: this.player, source: this.source };

        this.cardCondition = jasmine.createSpy('cardCondition');
        this.properties = {
            target: 1,
            cardCondition: this.cardCondition
        };
    });

    describe('a normal target', function() {
        beforeEach(function() {
            this.target = new AbilityTarget('foo', this.properties);
        });

        describe('canResolve()', function() {
            describe('when there is a non-draw card', function() {
                beforeEach(function() {
                    this.card1.getType.and.returnValue('plot');

                    this.target.canResolve(this.context);
                });

                it('should not call card condition on that card', function() {
                    expect(this.cardCondition).not.toHaveBeenCalledWith(this.card1, this.context);
                    expect(this.cardCondition).toHaveBeenCalledWith(this.card2, this.context);
                });
            });

            describe('when there is at least 1 matching card', function() {
                beforeEach(function() {
                    this.cardCondition.and.callFake(card => card === this.card2);
                });

                it('should return true', function() {
                    expect(this.target.canResolve(this.context)).toBe(true);
                });
            });

            describe('when there are no matching cards', function() {
                beforeEach(function() {
                    this.cardCondition.and.returnValue(false);
                });

                it('should return false', function() {
                    expect(this.target.canResolve(this.context)).toBe(false);
                });
            });
        });

        describe('resolve()', function() {
            it('should return a pending target result', function() {
                expect(this.target.resolve(this.context)).toEqual(jasmine.objectContaining({ resolved: false, name: 'foo', value: null, choosingPlayer: this.player, eligibleCards: [] }));
            });

            it('should prompt the player to select the target', function() {
                this.target.resolve(this.context);
                expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(this.player, { source: this.source, target: 1, onSelect: jasmine.any(Function), onCancel: jasmine.any(Function), selector: jasmine.any(Object), context: this.context });
            });

            describe('the select prompt', function() {
                beforeEach(function() {
                    this.result = this.target.resolve(this.context);
                    let call = this.gameSpy.promptForSelect.calls.mostRecent();
                    this.lastPromptProperties = call.args[1];
                });

                describe('when a card is selected', function() {
                    beforeEach(function() {
                        this.lastPromptProperties.onSelect(this.player, 'foo');
                    });

                    it('should resolve the result', function() {
                        expect(this.result.resolved).toBe(true);
                    });

                    it('should set the result value', function() {
                        expect(this.result.value).toBe('foo');
                    });
                });

                describe('when the prompt is cancelled', function() {
                    beforeEach(function() {
                        this.lastPromptProperties.onCancel();
                    });

                    it('should resolve the result', function() {
                        expect(this.result.resolved).toBe(true);
                    });

                    it('should cancel the result', function() {
                        expect(this.result.cancelled).toBe(true);
                    });

                    it('should not set the result value', function() {
                        expect(this.result.value).toBeFalsy();
                    });
                });
            });
        });
    });

    describe('with the ifAble flag', function() {
        beforeEach(function() {
            this.properties.ifAble = true;
            this.target = new AbilityTarget('foo', this.properties);
        });

        describe('canResolve()', function() {
            it('returns true even with no matching cards', function() {
                this.cardCondition.and.returnValue(false);

                expect(this.target.canResolve(this.context)).toBe(true);
            });
        });

        describe('resolve()', function() {
            describe('when there are no eligible targets', function() {
                beforeEach(function() {
                    this.cardCondition.and.returnValue(false);
                });

                it('does not prompt the player', function() {
                    this.target.resolve(this.context);

                    expect(this.gameSpy.promptForSelect).not.toHaveBeenCalled();
                });
            });

            describe('when there are eligible targets', function() {
                beforeEach(function() {
                    this.cardCondition.and.returnValue(true);
                });

                it('prompts the player to select the target', function() {
                    this.target.resolve(this.context);
                    expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(this.player, jasmine.objectContaining({ source: this.source, target: 1, onSelect: jasmine.any(Function), onCancel: jasmine.any(Function), selector: jasmine.any(Object), context: this.context }));
                });
            });

            describe('the select prompt', function() {
                beforeEach(function() {
                    this.cardCondition.and.returnValue(true);
                    this.result = this.target.resolve(this.context);
                    let call = this.gameSpy.promptForSelect.calls.mostRecent();
                    this.lastPromptProperties = call.args[1];
                });

                describe('when a card is selected', function() {
                    beforeEach(function() {
                        this.lastPromptProperties.onSelect(this.player, 'foo');
                    });

                    it('should resolve the result', function() {
                        expect(this.result.resolved).toBe(true);
                    });

                    it('should set the result value', function() {
                        expect(this.result.value).toBe('foo');
                    });
                });

                describe('when the prompt is cancelled', function() {
                    beforeEach(function() {
                        this.lastPromptProperties.onCancel();
                    });

                    it('should resolve the result', function() {
                        expect(this.result.resolved).toBe(true);
                    });

                    it('should not cancel the result', function() {
                        expect(this.result.cancelled).toBe(false);
                    });

                    it('should not set the result value', function() {
                        expect(this.result.value).toBeFalsy();
                    });
                });
            });
        });
    });
});
