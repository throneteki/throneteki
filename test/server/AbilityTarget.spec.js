import AbilityTarget from '../../server/game/AbilityTarget.js';

describe('AbilityTarget', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', [
            'addMessage',
            'getPlayersInFirstPlayerOrder',
            'promptForSelect',
            'queueSimpleStep'
        ]);
        this.gameSpy.queueSimpleStep.and.callFake((func) => func());
        this.card1 = jasmine.createSpyObj('card', ['allowGameAction', 'getType']);
        this.card1.allowGameAction.and.returnValue(true);
        this.card1.getType.and.returnValue('character');
        this.card2 = jasmine.createSpyObj('card', ['allowGameAction', 'getType']);
        this.card2.allowGameAction.and.returnValue(true);
        this.card2.getType.and.returnValue('location');
        this.gameSpy.allCards = [this.card1, this.card2];
        this.player = { player: 1 };
        this.source = { source: 1 };

        this.abilityMessagesSpy = jasmine.createSpyObj('abilityMessages', [
            'outputNoneSelected',
            'outputSelected',
            'outputSkipped',
            'outputUnable'
        ]);

        this.context = { game: this.gameSpy, player: this.player, source: this.source };

        this.cardCondition = jasmine.createSpy('cardCondition');
        this.properties = {
            target: 1,
            cardCondition: this.cardCondition,
            messages: this.abilityMessagesSpy
        };
    });

    describe('a normal target', function () {
        beforeEach(function () {
            this.target = new AbilityTarget('foo', this.properties);
        });

        describe('canResolve()', function () {
            describe('when there is a non-draw card', function () {
                beforeEach(function () {
                    this.card1.getType.and.returnValue('plot');

                    this.target.canResolve(this.context);
                });

                it('should not call card condition on that card', function () {
                    expect(this.cardCondition).not.toHaveBeenCalledWith(this.card1, this.context);
                    expect(this.cardCondition).toHaveBeenCalledWith(this.card2, this.context);
                });
            });

            describe('when there is at least 1 matching card', function () {
                beforeEach(function () {
                    this.cardCondition.and.callFake((card) => card === this.card2);
                });

                it('should return true', function () {
                    expect(this.target.canResolve(this.context)).toBe(true);
                });
            });

            describe('when there are no matching cards', function () {
                beforeEach(function () {
                    this.cardCondition.and.returnValue(false);
                });

                it('should return false', function () {
                    expect(this.target.canResolve(this.context)).toBe(false);
                });
            });
        });

        describe('resolve()', function () {
            it('should return an array of pending target result', function () {
                expect(this.target.resolve(this.context)).toEqual([
                    jasmine.objectContaining({
                        resolved: false,
                        name: 'foo',
                        value: null,
                        choosingPlayer: this.player,
                        eligibleChoices: []
                    })
                ]);
            });

            it('should prompt the player to select the target', function () {
                this.target.resolve(this.context);
                expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(this.player, {
                    source: this.source,
                    target: 1,
                    onSelect: jasmine.any(Function),
                    onCancel: jasmine.any(Function),
                    selector: jasmine.any(Object),
                    context: this.context
                });
            });

            describe('the select prompt', function () {
                beforeEach(function () {
                    this.result = this.target.resolve(this.context)[0];
                    let call = this.gameSpy.promptForSelect.calls.mostRecent();
                    this.lastPromptProperties = call.args[1];
                });

                describe('when a card is selected', function () {
                    beforeEach(function () {
                        this.lastPromptProperties.onSelect(this.player, 'foo');
                    });

                    it('should resolve the result', function () {
                        expect(this.result.resolved).toBe(true);
                    });

                    it('should set the result value', function () {
                        expect(this.result.value).toBe('foo');
                    });

                    it('should print the selection message', function () {
                        expect(this.abilityMessagesSpy.outputSelected).toHaveBeenCalledWith(
                            this.gameSpy,
                            this.context
                        );
                    });
                });

                describe('when no card is selected', function () {
                    beforeEach(function () {
                        this.lastPromptProperties.onSelect(this.player, null);
                    });

                    it('should resolve the result', function () {
                        expect(this.result.resolved).toBe(true);
                    });

                    it('should set the result value', function () {
                        expect(this.result.value).toBe(null);
                    });

                    it('should print the none selected message', function () {
                        expect(this.abilityMessagesSpy.outputNoneSelected).toHaveBeenCalledWith(
                            this.gameSpy,
                            this.context
                        );
                    });
                });

                describe('when an empty list of cards is selected', function () {
                    beforeEach(function () {
                        this.lastPromptProperties.onSelect(this.player, []);
                    });

                    it('should resolve the result', function () {
                        expect(this.result.resolved).toBe(true);
                    });

                    it('should set the result value', function () {
                        expect(this.result.value).toEqual([]);
                    });

                    it('should print the none selected message', function () {
                        expect(this.abilityMessagesSpy.outputNoneSelected).toHaveBeenCalledWith(
                            this.gameSpy,
                            this.context
                        );
                    });
                });

                describe('when the prompt is cancelled', function () {
                    beforeEach(function () {
                        this.lastPromptProperties.onCancel();
                    });

                    it('should resolve the result', function () {
                        expect(this.result.resolved).toBe(true);
                    });

                    it('should cancel the result', function () {
                        expect(this.result.cancelled).toBe(true);
                    });

                    it('should not set the result value', function () {
                        expect(this.result.value).toBeFalsy();
                    });
                });
            });
        });
    });

    describe('with the ifAble flag', function () {
        beforeEach(function () {
            this.properties.ifAble = true;
            this.target = new AbilityTarget('foo', this.properties);
        });

        describe('canResolve()', function () {
            it('returns true even with no matching cards', function () {
                this.cardCondition.and.returnValue(false);

                expect(this.target.canResolve(this.context)).toBe(true);
            });
        });

        describe('resolve()', function () {
            describe('when there are no eligible targets', function () {
                beforeEach(function () {
                    this.cardCondition.and.returnValue(false);
                    this.target.resolve(this.context);
                });

                it('does not prompt the player', function () {
                    expect(this.gameSpy.promptForSelect).not.toHaveBeenCalled();
                });

                it('should print the unable message', function () {
                    expect(this.abilityMessagesSpy.outputUnable).toHaveBeenCalledWith(
                        this.gameSpy,
                        this.context
                    );
                });
            });

            describe('when there are eligible targets', function () {
                beforeEach(function () {
                    this.cardCondition.and.returnValue(true);
                });

                it('prompts the player to select the target', function () {
                    this.target.resolve(this.context);
                    expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(
                        this.player,
                        jasmine.objectContaining({
                            source: this.source,
                            target: 1,
                            onSelect: jasmine.any(Function),
                            onCancel: jasmine.any(Function),
                            selector: jasmine.any(Object),
                            context: this.context
                        })
                    );
                });
            });

            describe('the select prompt', function () {
                beforeEach(function () {
                    this.cardCondition.and.returnValue(true);
                    this.result = this.target.resolve(this.context)[0];
                    let call = this.gameSpy.promptForSelect.calls.mostRecent();
                    this.lastPromptProperties = call.args[1];
                });

                describe('when a card is selected', function () {
                    beforeEach(function () {
                        this.lastPromptProperties.onSelect(this.player, 'foo');
                    });

                    it('should resolve the result', function () {
                        expect(this.result.resolved).toBe(true);
                    });

                    it('should set the result value', function () {
                        expect(this.result.value).toBe('foo');
                    });

                    it('should print the selection message', function () {
                        expect(this.abilityMessagesSpy.outputSelected).toHaveBeenCalledWith(
                            this.gameSpy,
                            this.context
                        );
                    });
                });

                describe('when the prompt is cancelled', function () {
                    beforeEach(function () {
                        this.lastPromptProperties.onCancel();
                    });

                    it('should resolve the result', function () {
                        expect(this.result.resolved).toBe(true);
                    });

                    it('should not cancel the result', function () {
                        expect(this.result.cancelled).toBe(false);
                    });

                    it('should not set the result value', function () {
                        expect(this.result.value).toBeFalsy();
                    });
                });
            });
        });
    });

    describe('an each-player target', function () {
        beforeEach(function () {
            this.player2 = { player: 2 };
            this.gameSpy.getPlayersInFirstPlayerOrder.and.returnValue([this.player, this.player2]);
            this.properties.choosingPlayer = 'each';
            this.target = new AbilityTarget('foo', this.properties);
        });

        describe('canResolve()', function () {
            describe('when all players have eligible cards', function () {
                beforeEach(function () {
                    this.cardCondition.and.returnValue(true);
                });

                it('returns true', function () {
                    expect(this.target.canResolve(this.context)).toBe(true);
                });

                it('checks the card condition for all players', function () {
                    // Had to keep track of the players as it was called because
                    // this mutates the context object and Jasmine only knows
                    // to check the final value, not the value when called.
                    let choosingPlayers = [];
                    this.cardCondition.and.callFake((card, context) => {
                        choosingPlayers.push(context.choosingPlayer);
                        return true;
                    });

                    this.target.canResolve(this.context);

                    expect(choosingPlayers).toEqual([this.player, this.player2]);
                });
            });

            describe('when any player does not have eligible cards', function () {
                beforeEach(function () {
                    this.cardCondition.and.callFake(
                        (card, context) => context.choosingPlayer === this.player2
                    );
                });

                it('returns false', function () {
                    expect(this.target.canResolve(this.context)).toBe(false);
                });
            });
        });

        describe('resolve()', function () {
            it('should return an array of pending target results for each player', function () {
                expect(this.target.resolve(this.context)).toEqual([
                    jasmine.objectContaining({
                        resolved: false,
                        name: 'foo',
                        value: null,
                        choosingPlayer: this.player,
                        eligibleChoices: []
                    }),
                    jasmine.objectContaining({
                        resolved: false,
                        name: 'foo',
                        value: null,
                        choosingPlayer: this.player2,
                        eligibleChoices: []
                    })
                ]);
            });

            it('should prompt each player to select the target', function () {
                this.target.resolve(this.context);
                expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(this.player, {
                    source: this.source,
                    target: 1,
                    onSelect: jasmine.any(Function),
                    onCancel: jasmine.any(Function),
                    selector: jasmine.any(Object),
                    context: this.context
                });
                expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(this.player2, {
                    source: this.source,
                    target: 1,
                    onSelect: jasmine.any(Function),
                    onCancel: jasmine.any(Function),
                    selector: jasmine.any(Object),
                    context: this.context
                });
            });
        });
    });
});
