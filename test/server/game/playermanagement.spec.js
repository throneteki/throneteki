import Game from '../../../server/game/game.js';

describe('Game', function () {
    beforeEach(function () {
        this.gameRouter = jasmine.createSpyObj('gameRouter', ['playerLeft', 'gameOver']);
        this.game = new Game(
            { allowSpectators: true, owner: {}, maxPlayers: 2 },
            { router: this.gameRouter }
        );
    });

    describe('join()', function () {
        describe('when the game has not started and there are not enough players', function () {
            beforeEach(function () {
                this.result = this.game.join('1', { username: 'foo', settings: {} });
            });

            it('should add the player', function () {
                expect(this.game.playersAndSpectators['foo']).toBeDefined();
                expect(this.game.playersAndSpectators['foo'].id).toBe('1');
            });

            it('should return true', function () {
                expect(this.result).toBe(true);
            });
        });

        describe('when the game has started', function () {
            beforeEach(function () {
                this.game.started = true;
                this.result = this.game.join('1', { username: 'foo', settings: {} });
            });

            it('should not add the player', function () {
                expect(this.game.playersAndSpectators['foo']).toBeUndefined();
            });

            it('should return false', function () {
                expect(this.result).toBe(false);
            });
        });

        describe('when the game already has two players', function () {
            beforeEach(function () {
                this.game.join('1', { username: 'foo', settings: {} });
                this.game.join('2', { username: 'bar', settings: {} });
                this.result = this.game.join('3', { username: 'baz', settings: {} });
            });

            it('should not add the player', function () {
                expect(this.game.playersAndSpectators['baz']).toBeUndefined();
            });

            it('should return false', function () {
                expect(this.result).toBe(false);
            });
        });
    });

    describe('watch()', function () {
        describe('when spectators are allowed', function () {
            beforeEach(function () {
                this.game.allowSpectators = true;
                this.result = this.game.watch('1', { username: 'foo', settings: {} });
            });

            it('should add the spectator', function () {
                expect(this.game.playersAndSpectators['foo']).toBeDefined();
                expect(this.game.playersAndSpectators['foo'].id).toBe('1');
                expect(this.game.playersAndSpectators['foo'].constructor.name).toBe('Spectator');
            });

            it('should return true', function () {
                expect(this.result).toBe(true);
            });
        });

        describe('when spectators are forbidden', function () {
            beforeEach(function () {
                this.game.allowSpectators = false;
                this.result = this.game.watch('1', { username: 'foo', settings: {} });
            });

            it('should not add the spectator', function () {
                expect(this.game.playersAndSpectators['foo']).toBeUndefined();
            });

            it('should return false', function () {
                expect(this.result).toBe(false);
            });
        });
    });

    describe('leave()', function () {
        describe('when the user is not part of the game', function () {
            it('should not crash', function () {
                expect(() => this.game.leave('nothere')).not.toThrow();
            });
        });

        describe('when the user is a player', function () {
            beforeEach(function () {
                this.game.join('1', { username: 'foo', settings: {} });
            });

            describe('when the game has not started', function () {
                it('should delete the player', function () {
                    this.game.leave('foo');
                    expect(this.game.playersAndSpectators['foo']).toBeUndefined();
                });
            });

            describe('when the game has started', function () {
                beforeEach(function () {
                    this.game.join('2', { username: 'bar', settings: {} });
                    this.game.started = true;
                });

                describe('and the game has not finished', function () {
                    beforeEach(function () {
                        this.game.leave('foo');
                    });

                    it('should mark the player as left', function () {
                        expect(this.game.playersAndSpectators['foo'].left).toBe(true);
                    });

                    it('should eliminate that player', function () {
                        expect(this.game.playersAndSpectators['foo'].eliminated).toBe(true);
                    });

                    it('should end the game', function () {
                        expect(this.game.isGameOver).toBe(true);
                    });
                });
            });
        });

        describe('when the user is a spectator', function () {
            beforeEach(function () {
                this.game.watch('1', { username: 'foo', settings: {} });
                this.game.leave('foo');
            });

            it('should delete the spectator', function () {
                expect(this.game.playersAndSpectators['foo']).toBeUndefined();
            });

            it('should not notify the router', function () {
                expect(this.gameRouter.playerLeft).not.toHaveBeenCalled();
            });
        });
    });

    describe('disconnect()', function () {
        describe('when the user is not part of the game', function () {
            it('should not crash', function () {
                expect(() => this.game.disconnect('nothere')).not.toThrow();
            });
        });

        describe('when the user is a player', function () {
            beforeEach(function () {
                this.game.join('1', { username: 'foo', settings: {} });
                this.game.join('2', { username: 'bar', settings: {} });
                this.player1 = this.game.playersAndSpectators['foo'];
                this.player2 = this.game.playersAndSpectators['bar'];
            });

            it('should mark the player as disconnected', function () {
                this.game.disconnect(this.player1.name);
                expect(this.game.isDisconnected(this.player1)).toBe(true);
            });

            it('should initially wait for the player to reconnect', function () {
                spyOn(this.game.disconnectHandler, 'waitForReconnect').and.callFake(() => true);
                this.game.disconnect(this.player1.name);
                expect(this.game.disconnectHandler.waitForReconnect).toHaveBeenCalledWith(
                    this.player1,
                    jasmine.any(Function)
                );
            });

            it('should not allow opponents to leave safely', function () {
                expect(this.game.canSafelyLeave(this.player2)).toBe(false);
            });

            describe('and they have disconnected beyond the wait period', function () {
                beforeEach(function () {
                    // Call "handler" without waiting
                    spyOn(this.game.disconnectHandler, 'waitForReconnect').and.callFake(
                        (player, handler) => handler(player)
                    );
                });

                it('should mark the player as long disconnected', function () {
                    this.game.disconnect(this.player1.name);
                    expect(this.game.isLongDisconnected(this.player1)).toBe(true);
                });

                describe('and it is joust', function () {
                    beforeEach(function () {
                        this.game.gameFormat = 'joust';
                        this.game.started = true;

                        this.game.disconnect(this.player1.name);
                    });

                    it('should allow the opponent to safely leave without auto-conceding', function () {
                        expect(this.game.canSafelyLeave(this.player2)).toBe(true);
                    });
                });

                describe('and it is melee', function () {
                    beforeEach(function () {
                        this.game.gameFormat = 'melee';
                        this.game.maxPlayers = 3;
                        this.game.join('2', { username: 'bar', settings: {} });
                        this.game.join('3', { username: 'baz', settings: {} });
                        this.player2 = this.game.playersAndSpectators['bar'];
                        this.player3 = this.game.playersAndSpectators['baz'];
                        // Populate player decks so they are not auto-eliminated
                        for (const player of [this.player1, this.player2, this.player3]) {
                            player.drawCards = [
                                { name: 'card1' },
                                { name: 'card2' },
                                { name: 'card3' }
                            ];
                        }
                        this.game.started = true;

                        this.game.disconnect(this.player1.name);
                    });

                    it('should not allow opponents to safely leave without auto-conceding', function () {
                        expect(this.game.canSafelyLeave(this.player2)).toBe(false);
                        expect(this.game.canSafelyLeave(this.player3)).toBe(false);
                    });
                    it('should allow the opponents to vote on waiting or eliminating that player', function () {
                        expect(this.player2).toHavePrompt('Wait for foo?');
                        expect(this.player2).toHavePromptButton('Yes');
                        expect(this.player2).toHavePromptButton('No (Eliminate)');
                        expect(this.player3).toHavePrompt('Wait for foo?');
                        expect(this.player3).toHavePromptButton('Yes');
                        expect(this.player3).toHavePromptButton('No (Eliminate)');
                    });

                    describe('and all but 1 player has left', function () {
                        beforeEach(function () {
                            this.game.disconnect(this.player2.name);
                        });

                        it('should allow the last opponent to leave without auto-conceding', function () {
                            expect(this.game.canSafelyLeave(this.player3)).toBe(true);
                        });
                    });
                });
            });
        });

        describe('when the user is a spectator', function () {
            beforeEach(function () {
                this.game.watch('1', { username: 'foo', settings: {} });
                this.spectator1 = this.game.playersAndSpectators['foo'];
                this.game.disconnect(this.spectator1.name);
            });

            it('should delete the spectator', function () {
                expect(this.game.playersAndSpectators[this.spectator1.name]).toBeUndefined();
            });
        });
    });

    describe('reconnect()', function () {
        beforeEach(function () {
            this.game.join('1', { username: 'foo', settings: {} });
            this.player1 = this.game.playersAndSpectators['foo'];
            this.game.disconnect('foo');
            this.game.reconnect({ id: '2' }, 'foo');
        });

        it('should not crash when the user is not part of the game', function () {
            expect(() => this.game.reconnect('nothere')).not.toThrow();
        });

        it('should set the new socket ID on the player', function () {
            expect(this.game.playersAndSpectators['foo'].socket.id).toBe('2');
        });

        it('should mark the player as no longer disconnected', function () {
            expect(this.game.isDisconnected(this.player1)).toBe(false);
        });
    });

    describe('isEmpty()', function () {
        describe('when there are no players', function () {
            it('should return true', function () {
                expect(this.game.isEmpty()).toBe(true);
            });
        });

        describe('when there are players and spectators', function () {
            beforeEach(function () {
                this.game.join('1', { username: 'foo', settings: {} });
                this.game.join('2', { username: 'bar', settings: {} });
                this.game.watch('3', { username: 'baz', settings: {} });
            });

            it('should return false', function () {
                expect(this.game.isEmpty()).toBe(false);
            });

            it('should return false if there is at least one player', function () {
                this.game.disconnect('foo');
                this.game.leave('baz');
                expect(this.game.isEmpty()).toBe(false);
            });

            it('should return false if there is at least one spectator', function () {
                this.game.leave('foo');
                this.game.disconnect('bar');
                expect(this.game.isEmpty()).toBe(false);
            });

            it('should return true if everyone has left', function () {
                this.game.leave('foo');
                this.game.leave('bar');
                this.game.leave('baz');
                expect(this.game.isEmpty()).toBe(true);
            });

            it('should return false if everyone has disconnected for a short period of time', function () {
                this.game.disconnect('foo');
                this.game.disconnect('bar');
                this.game.disconnect('baz');
                expect(this.game.isEmpty()).toBe(false);
            });

            it('should return true if everyone has disconnected for a long period of time', function () {
                spyOn(this.game.disconnectHandler, 'waitForReconnect').and.callFake(
                    (player, handler) => handler(player)
                );
                this.game.disconnect('foo');
                this.game.disconnect('bar');
                this.game.disconnect('baz');
                expect(this.game.isEmpty()).toBe(true);
            });
        });
    });

    describe('hasActivePlayer()', function () {
        beforeEach(function () {
            this.game.join('1', { username: 'foo', settings: {} });
        });

        it('should return falsy if the player is not in the game', function () {
            expect(this.game.hasActivePlayer('nothere')).toBeFalsy();
        });

        it('should return true if the player is active', function () {
            expect(this.game.hasActivePlayer('foo')).toBe(true);
        });

        it('should return true if the player is active but disconnected', function () {
            this.game.disconnect('foo');
            expect(this.game.hasActivePlayer('foo')).toBe(true);
        });

        it('should return falsy if the player has left', function () {
            this.game.leave('foo');
            expect(this.game.hasActivePlayer('foo')).toBeFalsy();
        });
    });
});
