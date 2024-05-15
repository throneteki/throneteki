import CardAction from '../../../server/game/cardaction.js';

describe('CardAction', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', [
            'on',
            'popAbilityContext',
            'pushAbilityContext',
            'removeListener',
            'raiseEvent',
            'resolveAbility',
            'resolveGameAction'
        ]);
        this.gameSpy.currentPhase = 'marshal';

        this.playerSpy = jasmine.createSpyObj('player', ['canTrigger']);
        this.playerSpy.canTrigger.and.returnValue(true);

        this.otherPlayerSpy = jasmine.createSpyObj('player', ['canTrigger']);
        this.otherPlayerSpy.canTrigger.and.returnValue(true);

        this.cardSpy = jasmine.createSpyObj('card', [
            'getPrintedType',
            'isAnyBlank',
            'createSnapshot'
        ]);
        this.cardSpy.createSnapshot.and.returnValue(this.cardSpy);
        this.handlerSpy = jasmine.createSpy('handler');

        this.limitSpy = jasmine.createSpyObj('limit', [
            'increment',
            'isAtMax',
            'registerEvents',
            'unregisterEvents'
        ]);

        this.gameSpy.raiseEvent.and.callFake((name, params, handler) => {
            if (handler) {
                handler(params);
            }
        });

        this.properties = {
            title: 'Do the thing',
            handler: this.handlerSpy
        };
    });

    describe('constructor', function () {
        describe('handler', function () {
            beforeEach(function () {
                this.context = {
                    player: 'player',
                    arg: 'arg',
                    foo: 'bar'
                };
            });

            describe('when handler is missing', function () {
                beforeEach(function () {
                    this.properties = {
                        title: 'Do the thing'
                    };
                });

                it('should throw an error', function () {
                    expect(() => {
                        new CardAction(this.gameSpy, this.cardSpy, this.properties);
                    }).toThrow();
                });
            });

            describe('when passed a handler directly', function () {
                beforeEach(function () {
                    this.properties = {
                        title: 'Do the thing',
                        handler: jasmine.createSpy('handler')
                    };
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                });

                it('should convert the handler to a game action', function () {
                    this.action.gameAction.createEvent(this.context).executeHandler();
                    expect(this.properties.handler).toHaveBeenCalledWith(this.context);
                });
            });
        });

        describe('location', function () {
            it('should default to play area', function () {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                expect(this.action.location).toBe('play area');
            });

            it('should default to agenda for cards with type agenda', function () {
                this.cardSpy.getPrintedType.and.returnValue('agenda');
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                expect(this.action.location).toBe('agenda');
            });

            it('should default to active plot for cards with type plot', function () {
                this.cardSpy.getPrintedType.and.returnValue('plot');
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                expect(this.action.location).toBe('active plot');
            });

            it('should default to hand for cards with type event', function () {
                this.cardSpy.getPrintedType.and.returnValue('event');
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                expect(this.action.location).toBe('hand');
            });

            it('should use the location sent via properties', function () {
                this.properties.location = 'foo';
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                expect(this.action.location).toBe('foo');
            });
        });

        describe('cost', function () {
            describe('when the card type is event', function () {
                beforeEach(function () {
                    this.cardSpy.getPrintedType.and.returnValue('event');
                    this.properties.cost = ['foo'];
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                });

                it('should add the play event costs', function () {
                    expect(this.action.cost.length).toBe(4);
                });
            });
        });
    });

    describe('execute()', function () {
        beforeEach(function () {
            this.player = this.playerSpy;
            this.cardSpy.controller = this.player;
            this.cardSpy.location = 'play area';
        });

        describe('when the action has limited uses', function () {
            beforeEach(function () {
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            describe('and the use count has reached the limit', function () {
                beforeEach(function () {
                    this.limitSpy.isAtMax.and.returnValue(true);

                    this.action.execute(this.player, 'arg');
                });

                it('should not queue the ability resolver', function () {
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });
            });

            describe('and the use count is below the limit', function () {
                beforeEach(function () {
                    this.action.execute(this.player, 'arg');
                });

                it('should queue the ability resolver', function () {
                    expect(this.gameSpy.resolveAbility).toHaveBeenCalled();
                });
            });
        });

        describe('when executed with a player other than the card controller', function () {
            beforeEach(function () {
                this.otherPlayer = this.otherPlayerSpy;
            });

            describe('and the anyPlayer property is not set', function () {
                beforeEach(function () {
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                    this.action.execute(this.otherPlayer, 'arg');
                });

                it('should not queue the ability resolver', function () {
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });
            });

            describe('and the anyPlayer property is set', function () {
                beforeEach(function () {
                    this.properties.anyPlayer = true;
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                    this.action.execute(this.otherPlayer, 'arg');
                });

                it('should queue the ability resolver', function () {
                    expect(this.gameSpy.resolveAbility).toHaveBeenCalled();
                });
            });
        });

        describe('when the card is not in a location for the action', function () {
            beforeEach(function () {
                this.cardSpy.location = 'hand';
                this.properties.location = 'play area';
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.execute(this.player, 'arg');
            });

            it('should not queue the ability resolver', function () {
                expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
            });
        });

        describe('when the card is blank', function () {
            beforeEach(function () {
                this.cardSpy.isAnyBlank.and.returnValue(true);
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.execute(this.player, 'arg');
            });

            it('should not queue the ability resolver', function () {
                expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
            });
        });

        describe('when only allowed in a certain phase', function () {
            beforeEach(function () {
                this.properties.phase = 'challenge';
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            describe('and it is not that phase', function () {
                beforeEach(function () {
                    this.gameSpy.currentPhase = 'dominance';
                    this.action.execute(this.player, 'arg');
                });

                it('should not queue the ability resolver', function () {
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });
            });

            describe('and it is the phase', function () {
                beforeEach(function () {
                    this.gameSpy.currentPhase = 'challenge';
                    this.action.execute(this.player, 'arg');
                });

                it('should queue the ability resolver', function () {
                    expect(this.gameSpy.resolveAbility).toHaveBeenCalled();
                });
            });
        });

        describe('when the current phase is setup', function () {
            beforeEach(function () {
                this.gameSpy.currentPhase = 'setup';
                this.properties.phase = 'any';
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.execute(this.player, 'arg');
            });

            it('should not queue the ability resolver', function () {
                expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
            });
        });

        describe('when a condition is provided', function () {
            beforeEach(function () {
                this.condition = jasmine.createSpy('condition');
                this.properties.condition = this.condition;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            describe('and the condition returns true', function () {
                beforeEach(function () {
                    this.condition.and.returnValue(true);
                    this.action.execute(this.player, 'arg');
                });

                it('should queue the ability resolver', function () {
                    expect(this.gameSpy.resolveAbility).toHaveBeenCalled();
                });
            });

            describe('and the condition returns false', function () {
                beforeEach(function () {
                    this.condition.and.returnValue(false);
                    this.action.execute(this.player, 'arg');
                });

                it('should not queue the ability resolver', function () {
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });
            });
        });

        describe('when all conditions met', function () {
            beforeEach(function () {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.execute(this.player, 'arg');
            });

            it('should queue the ability resolver', function () {
                expect(this.gameSpy.resolveAbility).toHaveBeenCalled();
            });
        });
    });

    describe('deactivate()', function () {
        beforeEach(function () {
            this.player = { player: 1 };
            this.cardSpy.controller = this.player;
            this.cardSpy.location = 'play area';
            this.costSpy = jasmine.createSpyObj('cost', ['canUnpay', 'unpay']);
            this.costSpy.canUnpay.and.returnValue(true);
            this.properties.cost = this.costSpy;
            this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            this.bottomContext = { context: 'bottom', player: this.player };
            this.topContext = { context: 'top', player: this.player };
            this.action.activationContexts.push(this.bottomContext);
            this.action.activationContexts.push(this.topContext);
        });

        describe('when everything is normal', function () {
            beforeEach(function () {
                this.result = this.action.deactivate(this.player);
            });

            it('should unpay costs', function () {
                expect(this.costSpy.unpay).toHaveBeenCalledWith(this.topContext);
            });

            it('should deactivate the top context', function () {
                expect(this.bottomContext.abilityDeactivated).toBeFalsy();
                expect(this.topContext.abilityDeactivated).toBe(true);
            });

            it('should return true', function () {
                expect(this.result).toBe(true);
            });
        });

        describe('when there are no previous activation contexts', function () {
            beforeEach(function () {
                this.action.activationContexts = [];
                this.result = this.action.deactivate(this.player);
            });

            it('should not unpay costs', function () {
                expect(this.costSpy.unpay).not.toHaveBeenCalled();
            });

            it('should not deactivate the top context', function () {
                expect(this.topContext.abilityDeactivated).toBeFalsy();
            });

            it('should return false', function () {
                expect(this.result).toBe(false);
            });
        });

        describe('when the cost cannot be unpaid', function () {
            beforeEach(function () {
                this.costSpy.canUnpay.and.returnValue(false);
                this.result = this.action.deactivate(this.player);
            });

            it('should not unpay costs', function () {
                expect(this.costSpy.unpay).not.toHaveBeenCalled();
            });

            it('should not deactivate the top context', function () {
                expect(this.topContext.abilityDeactivated).toBeFalsy();
            });

            it('should return false', function () {
                expect(this.result).toBe(false);
            });
        });

        describe('when the player does not control the source card', function () {
            beforeEach(function () {
                this.result = this.action.deactivate({ player: 2 });
            });

            it('should not unpay costs', function () {
                expect(this.costSpy.unpay).not.toHaveBeenCalled();
            });

            it('should not deactivate the top context', function () {
                expect(this.topContext.abilityDeactivated).toBeFalsy();
            });

            it('should return false', function () {
                expect(this.result).toBe(false);
            });
        });
    });

    describe('registerEvents()', function () {
        describe('when there is no limit', function () {
            beforeEach(function () {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.registerEvents();
            });

            it('should not register an event', function () {
                expect(this.limitSpy.registerEvents).not.toHaveBeenCalled();
            });
        });

        describe('when there is a limit', function () {
            beforeEach(function () {
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.registerEvents();
            });

            it('should register events for the limit', function () {
                expect(this.limitSpy.registerEvents).toHaveBeenCalledWith(this.gameSpy);
            });
        });
    });

    describe('unregisterEvents()', function () {
        describe('when there is no limit', function () {
            beforeEach(function () {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);

                this.action.unregisterEvents();
            });

            it('should not unregister an event', function () {
                expect(this.limitSpy.unregisterEvents).not.toHaveBeenCalled();
            });
        });

        describe('when there is a limit', function () {
            beforeEach(function () {
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);

                this.action.unregisterEvents();
            });

            it('should unregister events for the limit', function () {
                expect(this.limitSpy.unregisterEvents).toHaveBeenCalledWith(this.gameSpy);
            });
        });
    });

    describe('getMenuItem()', function () {
        beforeEach(function () {
            this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            this.menuItem = this.action.getMenuItem('arg', this.playerSpy);
        });

        it('returns the menu item format', function () {
            expect(this.menuItem).toEqual(
                jasmine.objectContaining({ text: 'Do the thing', method: 'doAction', arg: 'arg' })
            );
        });

        it('returns whether the menu item is for any player', function () {
            // The client passes this back to the server and is checked before
            // executing menu items that are requested by a non-controlling
            // player (e.g. Bronn).
            expect(this.menuItem['anyPlayer']).toBeDefined();
        });

        it('should include whether the menu item is disabled', function () {
            expect(this.menuItem['disabled']).toBeDefined();
        });
    });

    describe('executeHandler()', function () {
        beforeEach(function () {
            this.player = { player: true };
            this.context = {
                game: this.gameSpy,
                player: this.player,
                source: this.cardSpy,
                arg: 'arg'
            };
            this.handler = jasmine.createSpy('handler');
            this.properties.handler = this.handler;
            this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            this.action.executeHandler(this.context);
        });

        it('should resolve the game action', function () {
            expect(this.gameSpy.resolveGameAction).toHaveBeenCalledWith(
                jasmine.any(Object),
                this.context
            );
        });
    });
});
