import AbilityTarget from '../../server/game/AbilityTarget.js';

describe('AbilityTarget', function () {
    beforeEach(function () {
        this.gameSpy = {
            addMessage: vi.fn(),
            getPlayersInFirstPlayerOrder: vi.fn(),
            promptForSelect: vi.fn(),
            queueSimpleStep: vi.fn(),
            manualMode: { enabled: true }
        };
        this.gameSpy.queueSimpleStep.mockImplementation((func) => func());
        this.card1 = { allowGameAction: vi.fn(), getType: vi.fn() };
        this.card1.allowGameAction.mockReturnValue(true);
        this.card1.getType.mockReturnValue('character');
        this.card2 = { allowGameAction: vi.fn(), getType: vi.fn() };
        this.card2.allowGameAction.mockReturnValue(true);
        this.card2.getType.mockReturnValue('location');
        this.gameSpy.allCards = [this.card1, this.card2];
        this.player = { player: 1 };
        this.source = { source: 1 };

        this.abilityMessagesSpy = {
            outputNoneSelected: vi.fn(),
            outputSelected: vi.fn(),
            outputSkipped: vi.fn(),
            outputUnable: vi.fn()
        };

        this.context = { game: this.gameSpy, player: this.player, source: this.source };

        this.cardCondition = vi.fn();
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
                    this.card1.getType.mockReturnValue('plot');

                    this.target.canResolve(this.context);
                });

                it('should not call card condition on that card', function () {
                    expect(this.cardCondition).not.toHaveBeenCalledWith(this.card1, this.context);
                    expect(this.cardCondition).toHaveBeenCalledWith(this.card2, this.context);
                });
            });

            describe('when there is at least 1 matching card', function () {
                beforeEach(function () {
                    this.cardCondition.mockImplementation((card) => card === this.card2);
                });

                it('should return true', function () {
                    expect(this.target.canResolve(this.context)).toBe(true);
                });
            });

            describe('when there are no matching cards', function () {
                beforeEach(function () {
                    this.cardCondition.mockReturnValue(false);
                });

                it('should return false', function () {
                    expect(this.target.canResolve(this.context)).toBe(false);
                });
            });
        });

        describe('resolve()', function () {
            it('should return an array of pending target result', function () {
                expect(this.target.resolve(this.context)).toEqual([
                    expect.objectContaining({
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
                    onSelect: expect.any(Function),
                    onCancel: expect.any(Function),
                    canCancel: false,
                    cancelsWhenEmpty: true,
                    selector: expect.any(Object),
                    context: this.context
                });
            });

            describe('the select prompt', function () {
                beforeEach(function () {
                    this.result = this.target.resolve(this.context)[0];
                    let call = this.gameSpy.promptForSelect.mock.lastCall;
                    this.lastPromptProperties = call[1];
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
                this.cardCondition.mockReturnValue(false);

                expect(this.target.canResolve(this.context)).toBe(true);
            });
        });

        describe('resolve()', function () {
            describe('when there are no eligible targets', function () {
                beforeEach(function () {
                    this.cardCondition.mockReturnValue(false);
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
                    this.cardCondition.mockReturnValue(true);
                });

                it('prompts the player to select the target', function () {
                    this.target.resolve(this.context);
                    expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(
                        this.player,
                        expect.objectContaining({
                            source: this.source,
                            target: 1,
                            onSelect: expect.any(Function),
                            onCancel: expect.any(Function),
                            canCancel: false,
                            cancelsWhenEmpty: true,
                            selector: expect.any(Object),
                            context: this.context
                        })
                    );
                });
            });

            describe('the select prompt', function () {
                beforeEach(function () {
                    this.cardCondition.mockReturnValue(true);
                    this.result = this.target.resolve(this.context)[0];
                    let call = this.gameSpy.promptForSelect.mock.lastCall;
                    this.lastPromptProperties = call[1];
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
            this.gameSpy.getPlayersInFirstPlayerOrder.mockReturnValue([this.player, this.player2]);
            this.properties.choosingPlayer = 'each';
            this.target = new AbilityTarget('foo', this.properties);
        });

        describe('canResolve()', function () {
            describe('when all players have eligible cards', function () {
                beforeEach(function () {
                    this.cardCondition.mockReturnValue(true);
                });

                it('returns true', function () {
                    expect(this.target.canResolve(this.context)).toBe(true);
                });

                it('checks the card condition for all players', function () {
                    // Had to keep track of the players as it was called because
                    // this mutates the context object and Jasmine only knows
                    // to check the final value, not the value when called.
                    let choosingPlayers = [];
                    this.cardCondition.mockImplementation((card, context) => {
                        choosingPlayers.push(context.choosingPlayer);
                        return true;
                    });

                    this.target.canResolve(this.context);

                    expect(choosingPlayers).toEqual([this.player, this.player2]);
                });
            });

            describe('when any player does not have eligible cards', function () {
                beforeEach(function () {
                    this.cardCondition.mockImplementation(
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
                    expect.objectContaining({
                        resolved: false,
                        name: 'foo',
                        value: null,
                        choosingPlayer: this.player,
                        eligibleChoices: []
                    }),
                    expect.objectContaining({
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
                    onSelect: expect.any(Function),
                    onCancel: expect.any(Function),
                    canCancel: false,
                    cancelsWhenEmpty: true,
                    selector: expect.any(Object),
                    context: this.context
                });
                expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(this.player2, {
                    source: this.source,
                    target: 1,
                    onSelect: expect.any(Function),
                    onCancel: expect.any(Function),
                    canCancel: false,
                    cancelsWhenEmpty: true,
                    selector: expect.any(Object),
                    context: this.context
                });
            });
        });
    });
});
