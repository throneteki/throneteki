const AbilityResolver = require('../../../server/game/gamesteps/abilityresolver.js');

describe('AbilityResolver', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['addAlert', 'markActionAsTaken', 'popAbilityContext', 'pushAbilityContext', 'raiseEvent', 'resolveEvent', 'reportError']);
        this.game.raiseEvent.and.callFake((name, params, handler) => {
            if(handler) {
                handler(params);
            }
        });
        this.game.reportError.and.callFake(error => {
            throw error;
        });
        this.ability = jasmine.createSpyObj('ability', ['incrementLimit', 'isAction', 'isCardAbility', 'isForcedAbility', 'isPlayableEventAbility', 'needsChoosePlayer', 'outputMessage', 'resolveCosts', 'payCosts', 'resolveTargets', 'executeHandler', 'shouldHideSourceInMessage']);
        this.ability.isCardAbility.and.returnValue(true);
        this.ability.resolveCosts.and.returnValue([]);
        this.ability.resolveTargets.and.returnValue([]);
        this.player = jasmine.createSpyObj('player', ['moveCard']);
        this.source = jasmine.createSpyObj('source', ['createSnapshot', 'getType']);
        this.source.owner = this.player;
        let targets = jasmine.createSpyObj('targets', ['getTargets', 'hasTargets', 'setSelections', 'updateTargets', 'getTargetsToValidate']);
        targets.hasTargets.and.returnValue(true);
        targets.getTargets.and.returnValue([]);
        targets.getTargetsToValidate.and.returnValue([]);
        this.context = { foo: 'bar', player: this.player, source: this.source, targets: targets };
        this.resolver = new AbilityResolver(this.game, this.ability, this.context);
    });

    describe('continue()', function() {
        describe('when the ability is an action', function() {
            beforeEach(function() {
                this.ability.isAction.and.returnValue(true);
                this.resolver.continue();
            });

            it('should mark that an action is being taken', function() {
                expect(this.game.markActionAsTaken).toHaveBeenCalled();
            });
        });

        describe('when all costs can be paid', function() {
            beforeEach(function() {
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: true }]);
                this.resolver.continue();
            });

            it('should pay the costs', function() {
                expect(this.ability.payCosts).toHaveBeenCalledWith(this.context);
            });

            it('should execute the handler', function() {
                expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
            });

            it('should not raise the onCardPlayed event', function() {
                expect(this.game.raiseEvent).not.toHaveBeenCalledWith('onCardPlayed', jasmine.any(Object));
            });
        });

        describe('when the ability is a card ability', function() {
            beforeEach(function() {
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: true }]);
                this.ability.isPlayableEventAbility.and.returnValue(true);
                this.ability.isCardAbility.and.returnValue(true);
                this.resolver.continue();
            });

            it('should raise the onCardAbilityInitiated event', function() {
                expect(this.game.raiseEvent).toHaveBeenCalledWith('onCardAbilityInitiated', { player: this.player, source: this.source, ability: this.ability, targets: [], targetsToValidate: [], originalLocation: undefined }, jasmine.any(Function));
            });
        });

        describe('when the ability is not a card ability', function() {
            beforeEach(function() {
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: true }]);
                this.ability.isPlayableEventAbility.and.returnValue(true);
                this.ability.isCardAbility.and.returnValue(false);
                this.resolver.continue();
            });

            it('should not raise the onCardAbilityInitiated event', function() {
                expect(this.game.raiseEvent).not.toHaveBeenCalledWith('onCardAbilityInitiated', jasmine.any(Object), jasmine.any(Function));
            });
        });

        describe('when the ability is an event being played', function() {
            beforeEach(function() {
                this.source.eventPlacementLocation = 'event placement location';
                this.source.location = 'being played';
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: true }]);
                this.ability.isPlayableEventAbility.and.returnValue(true);
            });

            it('should move the card to the specified event location', function() {
                this.resolver.continue();
                expect(this.player.moveCard).toHaveBeenCalledWith(this.source, 'event placement location');
            });

            it('should raise the onCardPlayed event', function() {
                this.resolver.continue();
                expect(this.game.resolveEvent).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'onCardPlayed', card: this.source }));
            });

            describe('and the event is no longer in the "being played" state', function() {
                beforeEach(function() {
                    // Example: Risen from the Sea attached to character after playing it
                    this.source.location = 'play area';
                    this.resolver.continue();
                });

                it('should not move the card', function() {
                    expect(this.player.moveCard).not.toHaveBeenCalled();
                });
            });
        });

        describe('when not all costs can be paid', function() {
            beforeEach(function() {
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: false }]);
                this.resolver.continue();
            });

            it('should not pay the costs', function() {
                expect(this.ability.payCosts).not.toHaveBeenCalled();
            });

            it('should not execute the handler', function() {
                expect(this.ability.executeHandler).not.toHaveBeenCalled();
            });
        });

        describe('when a cost cannot be immediately resolved', function() {
            beforeEach(function() {
                this.canPayResult = { resolved: false };
                this.ability.resolveCosts.and.returnValue([this.canPayResult]);
                this.resolver.continue();
            });

            it('should not pay the costs', function() {
                expect(this.ability.payCosts).not.toHaveBeenCalled();
            });

            it('should not execute the handler', function() {
                expect(this.ability.executeHandler).not.toHaveBeenCalled();
            });

            describe('when the costs have resolved', function() {
                beforeEach(function() {
                    this.canPayResult.resolved = true;
                });

                describe('and the cost could be paid', function() {
                    beforeEach(function() {
                        this.canPayResult.value = true;
                        this.resolver.continue();
                    });

                    it('should pay the costs', function() {
                        expect(this.ability.payCosts).toHaveBeenCalledWith(this.context);
                    });

                    it('should execute the handler', function() {
                        expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
                    });
                });

                describe('and the cost could not be paid', function() {
                    beforeEach(function() {
                        this.canPayResult.value = false;
                        this.resolver.continue();
                    });

                    it('should not pay the costs', function() {
                        expect(this.ability.payCosts).not.toHaveBeenCalled();
                    });

                    it('should not execute the handler', function() {
                        expect(this.ability.executeHandler).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('when there are targets that need to be resolved', function() {
            beforeEach(function() {
                this.targetResult = { resolved: false, name: 'foo', value: null, targetingType: 'choose' };
                this.ability.resolveTargets.and.returnValue([this.targetResult]);
                this.resolver.continue();
            });

            it('should pay the costs', function() {
                expect(this.ability.payCosts).toHaveBeenCalled();
            });

            it('should not execute the handler', function() {
                expect(this.ability.executeHandler).not.toHaveBeenCalled();
            });

            describe('when the targets have resolved', function() {
                beforeEach(function() {
                    this.targetResult.resolved = true;
                });

                describe('and the targets were chosen', function() {
                    beforeEach(function() {
                        this.target = { foo: 'bar' };
                        this.targetResult.value = this.target;
                    });

                    describe('and the target name is arbitrary', function() {
                        beforeEach(function() {
                            this.targetResult.name = 'foo';
                            this.context.targets.getTargets.and.returnValue([this.target]);
                            this.context.targets.getTargetsToValidate.and.returnValue([this.target]);
                            this.resolver.continue();
                        });

                        it('should set target selections', function() {
                            expect(this.context.targets.setSelections).toHaveBeenCalledWith([jasmine.objectContaining({ name: 'foo', value: this.target })]);
                        });

                        it('should not add the target directly to context', function() {
                            expect(this.context.target).toBeUndefined();
                        });

                        it('should execute the handler', function() {
                            expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
                        });

                        it('should raise the onCardAbilityInitiated event with appropriate targets', function() {
                            expect(this.game.raiseEvent).toHaveBeenCalledWith('onCardAbilityInitiated', { player: this.player, source: this.source, ability: this.ability, targets: [this.target], targetsToValidate: [this.target], originalLocation: this.context.originalLocation }, jasmine.any(Function));
                        });
                    });

                    describe('and the target name is "target"', function() {
                        beforeEach(function() {
                            this.targetResult.name = 'target';
                            this.context.targets.defaultTarget = this.target;
                            this.resolver.continue();
                        });

                        it('should set target selections', function() {
                            expect(this.context.targets.setSelections).toHaveBeenCalledWith([jasmine.objectContaining({ value: this.target })]);
                        });

                        it('should add the target directly to context', function() {
                            expect(this.context.target).toBe(this.target);
                        });

                        it('should execute the handler', function() {
                            expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
                        });
                    });
                });

                describe('and the targets were not chosen', function() {
                    beforeEach(function() {
                        this.targetResult.cancelled = true;
                        this.resolver.continue();
                    });

                    it('should not execute the handler', function() {
                        expect(this.ability.executeHandler).not.toHaveBeenCalled();
                    });

                    it('should add an alert', function() {
                        expect(this.game.addAlert).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('when an exception occurs', function() {
            beforeEach(function() {
                this.error = new Error('something bad');
                this.game.reportError.and.callFake(() => {});
                this.ability.resolveCosts.and.callFake(() => {
                    throw this.error;
                });
            });

            it('should not propogate the error', function() {
                expect(() => this.resolver.continue()).not.toThrow();
            });

            it('should return true to complete the resolver pipeline', function() {
                expect(this.resolver.continue()).toBe(true);
            });

            it('should report the error', function() {
                this.resolver.continue();
                expect(this.game.reportError).toHaveBeenCalledWith(jasmine.any(Error));
            });

            describe('when the current ability context is for this ability', function() {
                beforeEach(function() {
                    this.game.currentAbilityContext = this.context;
                });

                it('should pop the current context', function() {
                    this.resolver.continue();
                    expect(this.game.popAbilityContext).toHaveBeenCalled();
                });
            });
        });
    });
});
