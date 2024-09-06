import EffectEngine from '../../server/game/effectengine.js';

describe('EffectEngine', function () {
    beforeEach(function () {
        this.playAreaCard = { location: 'play area' };
        this.handCard = { location: 'hand' };
        this.discardedCard = { location: 'discard pile' };
        this.drawCard = { location: 'draw deck' };
        this.deadCard = { location: 'dead pile' };
        this.activePlot = { location: 'active plot' };
        this.plotCard = { location: 'plot deck' };
        this.revealedPlot = { location: 'revealed plot' };
        this.agendaCard = { location: 'agenda' };
        this.factionCard = { location: 'faction card' };

        this.gameSpy = jasmine.createSpyObj('game', [
            'on',
            'removeListener',
            'getPlayers',
            'queueSimpleStep'
        ]);
        this.gameSpy.getPlayers.and.returnValue([]);
        this.gameSpy.queueSimpleStep.and.callFake((func) => func());
        this.gameSpy.allCards = [
            this.handCard,
            this.playAreaCard,
            this.discardedCard,
            this.drawCard,
            this.deadCard,
            this.activePlot,
            this.plotCard,
            this.revealedPlot,
            this.agendaCard,
            this.factionCard
        ];

        this.effectSpy = jasmine.createSpyObj('effect', [
            'addTargets',
            'clearInvalidTargets',
            'hasEnded',
            'isInActiveLocation',
            'reapply',
            'removeTarget',
            'cancel',
            'setActive',
            'updateAppliedTargets'
        ]);
        this.effectSpy.isInActiveLocation.and.returnValue(true);
        this.effectSpy.targetLocation = 'play area';

        this.engine = new EffectEngine(this.gameSpy);
    });

    describe('add()', function () {
        beforeEach(function () {
            this.engine.add(this.effectSpy);
        });

        it('should adds the effect to the list', function () {
            expect(this.engine.effects).toContain(this.effectSpy);
        });

        it('should add existing valid targets to the effect', function () {
            expect(this.effectSpy.addTargets).toHaveBeenCalledWith(
                jasmine.arrayContaining([
                    this.handCard,
                    this.playAreaCard,
                    this.discardedCard,
                    this.gameSpy
                ])
            );
        });

        describe('when the effect has custom duration', function () {
            beforeEach(function () {
                this.effectSpy.duration = 'custom';
                this.effectSpy.until = {
                    foo: () => true,
                    bar: () => true
                };
                this.engine.add(this.effectSpy);
            });

            it('should register event handlers for the until listeners', function () {
                expect(this.gameSpy.on).toHaveBeenCalledWith('foo', jasmine.any(Function));
                expect(this.gameSpy.on).toHaveBeenCalledWith('bar', jasmine.any(Function));
            });
        });
    });

    describe('getTargets()', function () {
        beforeEach(function () {
            this.player = {};
            this.gameSpy.getPlayers.and.returnValue([this.player]);
        });

        it('should not include cards in the revealed plots pile', function () {
            expect(this.engine.getTargets()).not.toContain(this.revealedPlot);
        });

        it('should not include agenda cards', function () {
            expect(this.engine.getTargets()).not.toContain(this.agendaCard);
        });

        it('should not include faction cards', function () {
            expect(this.engine.getTargets()).not.toContain(this.factionCard);
        });

        it('should include player objects', function () {
            expect(this.engine.getTargets()).toContain(this.player);
        });

        it('should include the game object', function () {
            expect(this.engine.getTargets()).toContain(this.gameSpy);
        });
    });

    describe('reapplyStateDependentEffects()', function () {
        beforeEach(function () {
            this.engine.effects = [this.effectSpy];
        });

        describe('when an effect is state dependent', function () {
            beforeEach(function () {
                this.effectSpy.isStateDependent = true;
                this.engine.reapplyStateDependentEffects();
            });

            it('should reapply valid targets', function () {
                expect(this.effectSpy.reapply).toHaveBeenCalledWith(
                    jasmine.arrayContaining([
                        this.handCard,
                        this.playAreaCard,
                        this.discardedCard,
                        this.gameSpy
                    ])
                );
            });
        });

        describe('when an effect is state dependent but it has ended', function () {
            beforeEach(function () {
                this.effectSpy.isStateDependent = true;
                this.effectSpy.hasEnded.and.returnValue(true);
                this.engine.reapplyStateDependentEffects();
            });

            it('should cancel the effect', function () {
                expect(this.effectSpy.cancel).toHaveBeenCalled();
            });

            it('should remove the effect', function () {
                expect(this.engine.effects).not.toContain(this.effectSpy);
            });
        });

        describe('when an effect is not state dependent', function () {
            beforeEach(function () {
                this.effectSpy.isStateDependent = false;
                this.engine.reapplyStateDependentEffects();
            });

            it('should not reapply valid targets', function () {
                expect(this.effectSpy.reapply).not.toHaveBeenCalled();
            });
        });
    });

    describe('onCardBlankToggled()', function () {
        beforeEach(function () {
            this.engine.effects = [this.effectSpy];
            this.cardBeingToggled = {};
        });

        describe('when an effect has persistent duration', function () {
            beforeEach(function () {
                this.effectSpy.duration = 'persistent';
            });

            describe('and the card being blanked is the source for an effect', function () {
                beforeEach(function () {
                    this.effectSpy.source = this.cardBeingToggled;
                    this.engine.onCardBlankToggled({ card: this.cardBeingToggled, isBlank: false });
                });

                it('should set the active value for the effect along with cards to target', function () {
                    expect(this.effectSpy.setActive).toHaveBeenCalledWith(
                        true,
                        jasmine.arrayContaining([
                            this.handCard,
                            this.playAreaCard,
                            this.discardedCard,
                            this.gameSpy
                        ])
                    );
                });
            });

            describe('and the card being blanked is not the source for an effect', function () {
                beforeEach(function () {
                    this.effectSpy.source = {};
                    this.engine.onCardBlankToggled({ card: this.cardBeingToggled, isBlank: false });
                });

                it('should not set the active value for the effect', function () {
                    expect(this.effectSpy.setActive).not.toHaveBeenCalled();
                });
            });
        });

        describe('when an effect has a non-persistent duration', function () {
            beforeEach(function () {
                this.effectSpy.duration = 'untilEndOfChallenge';
            });

            describe('and the card being blanked is the source for an effect', function () {
                beforeEach(function () {
                    this.effectSpy.source = this.cardBeingToggled;
                    this.engine.onCardBlankToggled({ card: this.cardBeingToggled, isBlank: false });
                });

                it('should not set the active value for the effect', function () {
                    expect(this.effectSpy.setActive).not.toHaveBeenCalled();
                });
            });

            describe('and the card being blanked is not the source for an effect', function () {
                beforeEach(function () {
                    this.effectSpy.source = {};
                    this.engine.onCardBlankToggled({ card: this.cardBeingToggled, isBlank: false });
                });

                it('should not set the active value for the effect', function () {
                    expect(this.effectSpy.setActive).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('onChallengeFinished()', function () {
        beforeEach(function () {
            this.engine.effects = [this.effectSpy];
        });

        describe('when an effect has untilEndOfChallenge duration', function () {
            beforeEach(function () {
                this.effectSpy.duration = 'untilEndOfChallenge';
                this.engine.onChallengeFinished({ challenge: {} });
            });

            it('should cancel the effect', function () {
                expect(this.effectSpy.cancel).toHaveBeenCalled();
            });

            it('should remove the effect from the list', function () {
                expect(this.engine.effects).not.toContain(this.effectSpy);
            });
        });

        describe('when an effect has a non-untilEndOfChallenge duration', function () {
            beforeEach(function () {
                this.effectSpy.duration = 'persistent';
                this.engine.onChallengeFinished({ challenge: {} });
            });

            it('should not cancel the effect', function () {
                expect(this.effectSpy.cancel).not.toHaveBeenCalled();
            });

            it('should not remove the effect from the list', function () {
                expect(this.engine.effects).toContain(this.effectSpy);
            });
        });
    });

    describe('onPhaseEnded()', function () {
        beforeEach(function () {
            this.engine.effects = [this.effectSpy];
        });

        describe('when an effect has untilEndOfPhase duration', function () {
            beforeEach(function () {
                this.effectSpy.duration = 'untilEndOfPhase';
                this.engine.onPhaseEnded({ phase: 'marshal' });
            });

            it('should cancel the effect', function () {
                expect(this.effectSpy.cancel).toHaveBeenCalled();
            });

            it('should remove the effect from the list', function () {
                expect(this.engine.effects).not.toContain(this.effectSpy);
            });
        });

        describe('when an effect has a non-untilEndOfPhase duration', function () {
            beforeEach(function () {
                this.effectSpy.duration = 'persistent';
                this.engine.onPhaseEnded({ phase: 'marshal' });
            });

            it('should not cancel the effect', function () {
                expect(this.effectSpy.cancel).not.toHaveBeenCalled();
            });

            it('should not remove the effect from the list', function () {
                expect(this.engine.effects).toContain(this.effectSpy);
            });
        });
    });

    describe('onAtEndOfPhase()', function () {
        beforeEach(function () {
            this.engine.effects = [this.effectSpy];
        });

        describe('when an effect has atEndOfPhase duration', function () {
            beforeEach(function () {
                this.effectSpy.duration = 'atEndOfPhase';
                this.engine.onAtEndOfPhase({});
            });

            it('should cancel the effect', function () {
                expect(this.effectSpy.cancel).toHaveBeenCalled();
            });

            it('should remove the effect from the list', function () {
                expect(this.engine.effects).not.toContain(this.effectSpy);
            });
        });

        describe('when an effect has a non-atEndOfPhase duration', function () {
            beforeEach(function () {
                this.effectSpy.duration = 'persistent';
                this.engine.onAtEndOfPhase({});
            });

            it('should not cancel the effect', function () {
                expect(this.effectSpy.cancel).not.toHaveBeenCalled();
            });

            it('should not remove the effect from the list', function () {
                expect(this.engine.effects).toContain(this.effectSpy);
            });
        });
    });

    describe('onRoundEnded()', function () {
        beforeEach(function () {
            this.engine.effects = [this.effectSpy];
        });

        describe('when an effect has untilEndOfRound duration', function () {
            beforeEach(function () {
                this.effectSpy.duration = 'untilEndOfRound';
                this.engine.onRoundEnded({});
            });

            it('should cancel the effect', function () {
                expect(this.effectSpy.cancel).toHaveBeenCalled();
            });

            it('should remove the effect from the list', function () {
                expect(this.engine.effects).not.toContain(this.effectSpy);
            });
        });

        describe('when an effect has a non-untilEndOfRound duration', function () {
            beforeEach(function () {
                this.effectSpy.duration = 'persistent';
                this.engine.onRoundEnded({});
            });

            it('should not cancel the effect', function () {
                expect(this.effectSpy.cancel).not.toHaveBeenCalled();
            });

            it('should not remove the effect from the list', function () {
                expect(this.engine.effects).toContain(this.effectSpy);
            });
        });
    });

    describe('custom duration event handlers', function () {
        beforeEach(function () {
            this.effectSpy.duration = 'custom';
            this.effectSpy.until = {
                foo: jasmine.createSpy('listener')
            };
            this.effectSpy2 = jasmine.createSpyObj('effect', [
                'addTargets',
                'isInActiveLocation',
                'reapply',
                'removeTarget',
                'cancel',
                'setActive'
            ]);
            this.effectSpy2.isInActiveLocation.and.returnValue(true);
            this.effectSpy2.targetLocation = 'play area';
            this.effectSpy2.duration = 'custom';
            this.effectSpy2.until = { foo: () => true };

            this.engine.add(this.effectSpy);
            this.engine.add(this.effectSpy2);

            this.handler = this.engine.createCustomDurationHandler('foo', this.effectSpy);
        });

        describe('when called for an unregistered event', function () {
            it('should not crash', function () {
                expect(() => this.handler({ name: 'bar' }, 1)).not.toThrow();
            });
        });

        describe('when the until listener returns true', function () {
            beforeEach(function () {
                this.effectSpy.until.foo.and.returnValue(true);
                this.event = { name: 'foo' };
                this.handler(this.event, 1, 2, 3);
            });

            it('should call the listener with the right arguments', function () {
                expect(this.effectSpy.until.foo).toHaveBeenCalledWith(this.event, 1, 2, 3);
            });

            it('should cancel the effect', function () {
                expect(this.effectSpy.cancel).toHaveBeenCalled();
            });

            it('should unregister event listeners', function () {
                expect(this.gameSpy.removeListener).toHaveBeenCalledWith(
                    'foo',
                    jasmine.any(Function)
                );
                expect(this.engine.customDurationEvents).not.toContain(
                    jasmine.objectContaining({ effect: this.effectSpy })
                );
            });

            it('should remove the effect from play', function () {
                expect(this.engine.effects).not.toContain(this.effectSpy);
            });

            it('should not remove listeners for other effects', function () {
                expect(this.engine.customDurationEvents).toContain(
                    jasmine.objectContaining({ effect: this.effectSpy2 })
                );
            });
        });

        describe('when the until listener returns false', function () {
            beforeEach(function () {
                this.effectSpy.until.foo.and.returnValue(false);
                this.event = { name: 'foo' };
                this.handler(this.event, 1, 2, 3);
            });

            it('should call the listener with the right arguments', function () {
                expect(this.effectSpy.until.foo).toHaveBeenCalledWith(this.event, 1, 2, 3);
            });

            it('should not cancel the effect', function () {
                expect(this.effectSpy.cancel).not.toHaveBeenCalled();
            });

            it('should not unregister event listeners', function () {
                expect(this.gameSpy.removeListener).not.toHaveBeenCalledWith(
                    'foo',
                    jasmine.any(Function)
                );
                expect(this.engine.customDurationEvents).toContain(
                    jasmine.objectContaining({ effect: this.effectSpy })
                );
            });

            it('should not remove the effect from play', function () {
                expect(this.engine.effects).toContain(this.effectSpy);
            });

            it('should not remove listeners for other effects', function () {
                expect(this.engine.customDurationEvents).toContain(
                    jasmine.objectContaining({ effect: this.effectSpy2 })
                );
            });
        });
    });
});
