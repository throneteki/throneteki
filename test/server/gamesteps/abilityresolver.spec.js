import AbilityResolver from '../../../server/game/gamesteps/abilityresolver.js';

describe('AbilityResolver', function () {
    beforeEach(function () {
        this.game = {
            addAlert: vi.fn(),
            markActionAsTaken: vi.fn(),
            popAbilityContext: vi.fn(),
            pushAbilityContext: vi.fn(),
            raiseEvent: vi.fn(),
            resolveEvent: vi.fn(),
            reportError: vi.fn()
        };
        this.game.raiseEvent.mockImplementation((name, params, handler) => {
            if (handler) {
                handler(params);
            }
        });
        this.game.reportError.mockImplementation((error) => {
            throw error;
        });
        this.ability = {
            incrementLimit: vi.fn(),
            isAction: vi.fn(),
            isCardAbility: vi.fn(),
            isForcedAbility: vi.fn(),
            isPlayableEventAbility: vi.fn(),
            needsChoosePlayer: vi.fn(),
            outputMessage: vi.fn(),
            resolveCosts: vi.fn(),
            payCosts: vi.fn(),
            resolveTargets: vi.fn(),
            executeHandler: vi.fn(),
            shouldHideSourceInMessage: vi.fn()
        };
        this.ability.isCardAbility.mockReturnValue(true);
        this.ability.resolveCosts.mockReturnValue([]);
        this.ability.resolveTargets.mockReturnValue([]);
        this.player = { moveCard: vi.fn() };
        this.source = { createSnapshot: vi.fn(), getType: vi.fn() };
        this.source.owner = this.player;
        let targets = {
            getTargets: vi.fn(),
            hasTargets: vi.fn(),
            setSelections: vi.fn(),
            updateTargets: vi.fn(),
            getTargetsToValidate: vi.fn()
        };
        targets.hasTargets.mockReturnValue(true);
        targets.getTargets.mockReturnValue([]);
        targets.getTargetsToValidate.mockReturnValue([]);
        this.context = { foo: 'bar', player: this.player, source: this.source, targets: targets };
        this.resolver = new AbilityResolver(this.game, this.ability, this.context);
    });

    describe('continue()', function () {
        describe('when the ability is an action', function () {
            beforeEach(function () {
                this.ability.isAction.mockReturnValue(true);
                this.resolver.continue();
            });

            it('should mark that an action is being taken', function () {
                expect(this.game.markActionAsTaken).toHaveBeenCalled();
            });
        });

        describe('when all costs can be paid', function () {
            beforeEach(function () {
                this.ability.resolveCosts.mockReturnValue([
                    { resolved: true, value: true },
                    { resolved: true, value: true }
                ]);
                this.resolver.continue();
            });

            it('should pay the costs', function () {
                expect(this.ability.payCosts).toHaveBeenCalledWith(this.context);
            });

            it('should execute the handler', function () {
                expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
            });

            it('should not raise the onCardPlayed event', function () {
                expect(this.game.raiseEvent).not.toHaveBeenCalledWith(
                    'onCardPlayed',
                    expect.any(Object)
                );
            });
        });

        describe('when the ability is a card ability', function () {
            beforeEach(function () {
                this.ability.resolveCosts.mockReturnValue([
                    { resolved: true, value: true },
                    { resolved: true, value: true }
                ]);
                this.ability.isPlayableEventAbility.mockReturnValue(true);
                this.ability.isCardAbility.mockReturnValue(true);
                this.resolver.continue();
            });

            it('should raise the onCardAbilityInitiated event', function () {
                expect(this.game.raiseEvent).toHaveBeenCalledWith(
                    'onCardAbilityInitiated',
                    {
                        player: this.player,
                        source: this.source,
                        ability: this.ability,
                        targets: [],
                        targetsToValidate: [],
                        originalLocation: undefined
                    },
                    expect.any(Function)
                );
            });
        });

        describe('when the ability is not a card ability', function () {
            beforeEach(function () {
                this.ability.resolveCosts.mockReturnValue([
                    { resolved: true, value: true },
                    { resolved: true, value: true }
                ]);
                this.ability.isPlayableEventAbility.mockReturnValue(true);
                this.ability.isCardAbility.mockReturnValue(false);
                this.resolver.continue();
            });

            it('should not raise the onCardAbilityInitiated event', function () {
                expect(this.game.raiseEvent).not.toHaveBeenCalledWith(
                    'onCardAbilityInitiated',
                    expect.any(Object),
                    expect.any(Function)
                );
            });
        });

        describe('when the ability is an event being played', function () {
            beforeEach(function () {
                this.source.eventPlacementLocation = 'event placement location';
                this.source.location = 'being played';
                this.ability.resolveCosts.mockReturnValue([
                    { resolved: true, value: true },
                    { resolved: true, value: true }
                ]);
                this.ability.isPlayableEventAbility.mockReturnValue(true);
            });

            it('should move the card to the specified event location', function () {
                this.resolver.continue();
                expect(this.player.moveCard).toHaveBeenCalledWith(
                    this.source,
                    'event placement location'
                );
            });

            it('should raise the onCardPlayed event', function () {
                this.resolver.continue();
                expect(this.game.resolveEvent).toHaveBeenCalledWith(
                    expect.objectContaining({ name: 'onCardPlayed', card: this.source })
                );
            });

            describe('and the event is no longer in the "being played" state', function () {
                beforeEach(function () {
                    // Example: Risen from the Sea attached to character after playing it
                    this.source.location = 'play area';
                    this.resolver.continue();
                });

                it('should not move the card', function () {
                    expect(this.player.moveCard).not.toHaveBeenCalled();
                });
            });
        });

        describe('when not all costs can be paid', function () {
            beforeEach(function () {
                this.ability.resolveCosts.mockReturnValue([
                    { resolved: true, value: true },
                    { resolved: true, value: false }
                ]);
                this.resolver.continue();
            });

            it('should not pay the costs', function () {
                expect(this.ability.payCosts).not.toHaveBeenCalled();
            });

            it('should not execute the handler', function () {
                expect(this.ability.executeHandler).not.toHaveBeenCalled();
            });
        });

        describe('when a cost cannot be immediately resolved', function () {
            beforeEach(function () {
                this.canPayResult = { resolved: false };
                this.ability.resolveCosts.mockReturnValue([this.canPayResult]);
                this.resolver.continue();
            });

            it('should not pay the costs', function () {
                expect(this.ability.payCosts).not.toHaveBeenCalled();
            });

            it('should not execute the handler', function () {
                expect(this.ability.executeHandler).not.toHaveBeenCalled();
            });

            describe('when the costs have resolved', function () {
                beforeEach(function () {
                    this.canPayResult.resolved = true;
                });

                describe('and the cost could be paid', function () {
                    beforeEach(function () {
                        this.canPayResult.value = true;
                        this.resolver.continue();
                    });

                    it('should pay the costs', function () {
                        expect(this.ability.payCosts).toHaveBeenCalledWith(this.context);
                    });

                    it('should execute the handler', function () {
                        expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
                    });
                });

                describe('and the cost could not be paid', function () {
                    beforeEach(function () {
                        this.canPayResult.value = false;
                        this.resolver.continue();
                    });

                    it('should not pay the costs', function () {
                        expect(this.ability.payCosts).not.toHaveBeenCalled();
                    });

                    it('should not execute the handler', function () {
                        expect(this.ability.executeHandler).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('when there are targets that need to be resolved', function () {
            beforeEach(function () {
                this.targetResult = {
                    resolved: false,
                    name: 'foo',
                    value: null,
                    targetingType: 'choose'
                };
                this.ability.resolveTargets.mockReturnValue([this.targetResult]);
                this.resolver.continue();
            });

            it('should pay the costs', function () {
                expect(this.ability.payCosts).toHaveBeenCalled();
            });

            it('should not execute the handler', function () {
                expect(this.ability.executeHandler).not.toHaveBeenCalled();
            });

            describe('when the targets have resolved', function () {
                beforeEach(function () {
                    this.targetResult.resolved = true;
                });

                describe('and the targets were chosen', function () {
                    beforeEach(function () {
                        this.target = { foo: 'bar' };
                        this.targetResult.value = this.target;
                    });

                    describe('and the target name is arbitrary', function () {
                        beforeEach(function () {
                            this.targetResult.name = 'foo';
                            this.context.targets.getTargets.mockReturnValue([this.target]);
                            this.context.targets.getTargetsToValidate.mockReturnValue([
                                this.target
                            ]);
                            this.resolver.continue();
                        });

                        it('should set target selections', function () {
                            expect(this.context.targets.setSelections).toHaveBeenCalledWith([
                                expect.objectContaining({ name: 'foo', value: this.target })
                            ]);
                        });

                        it('should not add the target directly to context', function () {
                            expect(this.context.target).toBeUndefined();
                        });

                        it('should execute the handler', function () {
                            expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
                        });

                        it('should raise the onCardAbilityInitiated event with appropriate targets', function () {
                            expect(this.game.raiseEvent).toHaveBeenCalledWith(
                                'onCardAbilityInitiated',
                                {
                                    player: this.player,
                                    source: this.source,
                                    ability: this.ability,
                                    targets: [this.target],
                                    targetsToValidate: [this.target],
                                    originalLocation: this.context.originalLocation
                                },
                                expect.any(Function)
                            );
                        });
                    });

                    describe('and the target name is "target"', function () {
                        beforeEach(function () {
                            this.targetResult.name = 'target';
                            this.context.targets.defaultTarget = this.target;
                            this.resolver.continue();
                        });

                        it('should set target selections', function () {
                            expect(this.context.targets.setSelections).toHaveBeenCalledWith([
                                expect.objectContaining({ value: this.target })
                            ]);
                        });

                        it('should add the target directly to context', function () {
                            expect(this.context.target).toBe(this.target);
                        });

                        it('should execute the handler', function () {
                            expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
                        });
                    });
                });

                describe('and the targets were not chosen', function () {
                    beforeEach(function () {
                        this.targetResult.cancelled = true;
                        this.resolver.continue();
                    });

                    it('should not execute the handler', function () {
                        expect(this.ability.executeHandler).not.toHaveBeenCalled();
                    });

                    it('should add an alert', function () {
                        expect(this.game.addAlert).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('when an exception occurs', function () {
            beforeEach(function () {
                this.error = new Error('something bad');
                this.game.reportError.mockImplementation(() => {});
                this.ability.resolveCosts.mockImplementation(() => {
                    throw this.error;
                });
            });

            it('should not propogate the error', function () {
                expect(() => this.resolver.continue()).not.toThrow();
            });

            it('should return true to complete the resolver pipeline', function () {
                expect(this.resolver.continue()).toBe(true);
            });

            it('should report the error', function () {
                this.resolver.continue();
                expect(this.game.reportError).toHaveBeenCalledWith(expect.any(Error));
            });

            describe('when the current ability context is for this ability', function () {
                beforeEach(function () {
                    this.game.currentAbilityContext = this.context;
                });

                it('should pop the current context', function () {
                    this.resolver.continue();
                    expect(this.game.popAbilityContext).toHaveBeenCalled();
                });
            });
        });
    });
});
