import ChatCommands from '../../../server/game/chatcommands.js';

describe('ChatCommands', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'addAlert']);

        this.playerSpy = jasmine.createSpyObj('player', [
            'drawCardsToHand',
            'discardAtRandom',
            'discardFromDraw'
        ]);
        this.chatCommands = new ChatCommands(this.gameSpy);
    });

    describe('getNumberOrDefault()', function () {
        describe('with no arguments', function () {
            it('should return the default', function () {
                expect(this.chatCommands.getNumberOrDefault('', 1)).toBe(1);
            });
        });

        describe('with a string argument', function () {
            it('should return the default', function () {
                expect(this.chatCommands.getNumberOrDefault('test', 1)).toBe(1);
            });
        });

        describe('with a negative argument', function () {
            it('should return the default', function () {
                expect(this.chatCommands.getNumberOrDefault('-1', 1)).toBe(1);
            });
        });

        describe('with a valid argument', function () {
            it('should return the parsed value', function () {
                expect(this.chatCommands.getNumberOrDefault('3', 1)).toBe(3);
            });
        });
    });

    describe('executeCommand()', function () {
        describe('with a non-existent command', function () {
            it('should return false', function () {
                let result = this.chatCommands.executeCommand(this.playerSpy, '/foo', [
                    '/foo',
                    'bar'
                ]);

                expect(result).toBe(false);
            });
        });

        describe('with a valid command', function () {
            it('should return true', function () {
                let result = this.chatCommands.executeCommand(this.playerSpy, '/pillage', [
                    '/pillage'
                ]);

                expect(result).toBe(true);
            });
        });

        describe('with a /draw command', function () {
            describe('with no arguments', function () {
                it('should draw 1 card', function () {
                    this.chatCommands.executeCommand(this.playerSpy, '/draw', ['/draw']);

                    expect(this.playerSpy.drawCardsToHand).toHaveBeenCalledWith(1);
                });
            });

            describe('with a string argument', function () {
                it('should draw 1 card', function () {
                    this.chatCommands.executeCommand(this.playerSpy, '/draw', ['/draw', 'test']);

                    expect(this.playerSpy.drawCardsToHand).toHaveBeenCalledWith(1);
                });
            });

            describe('with a negative argument', function () {
                it('should draw 1 card', function () {
                    this.chatCommands.executeCommand(this.playerSpy, '/draw', ['/draw', '-1']);

                    expect(this.playerSpy.drawCardsToHand).toHaveBeenCalledWith(1);
                });
            });

            describe('with a valid argument', function () {
                it('should draw the passed amount of cards', function () {
                    this.chatCommands.executeCommand(this.playerSpy, '/draw', ['/draw', '4']);

                    expect(this.playerSpy.drawCardsToHand).toHaveBeenCalledWith(4);
                });
            });
        });

        describe('with a /power command', function () {
            beforeEach(function () {
                this.gameSpy.promptForSelect = jasmine.createSpy('promptForSelect');
                this.card = { power: 2, getType: () => 'character' };

                this.setPower = (args) => {
                    this.chatCommands.executeCommand(this.playerSpy, '/power', args);
                    this.gameSpy.promptForSelect.calls
                        .mostRecent()
                        .args[1].onSelect(this.playerSpy, this.card);
                };
            });

            it('should set the power of the selected card', function () {
                this.setPower(['/power', '5']);

                expect(this.card.power).toBe(5);
            });

            it('should set the power to at most 99', function () {
                this.setPower(['/power', '1111111111111111000000000000000']);

                expect(this.card.power).toBe(99);
                expect(this.gameSpy.addAlert).toHaveBeenCalledWith(
                    'danger',
                    jasmine.any(String),
                    this.playerSpy,
                    this.card,
                    99
                );
            });
        });

        describe('with a /discard command', function () {
            describe('with no arguments', function () {
                it('should discard 1 card', function () {
                    this.chatCommands.executeCommand(this.playerSpy, '/discard', ['/discard']);

                    expect(this.playerSpy.discardAtRandom).toHaveBeenCalledWith(1);
                });
            });

            describe('with a string argument', function () {
                it('should discard 1 card', function () {
                    this.chatCommands.executeCommand(this.playerSpy, '/discard', [
                        '/discard',
                        'test'
                    ]);

                    expect(this.playerSpy.discardAtRandom).toHaveBeenCalledWith(1);
                });
            });

            describe('with a negative argument', function () {
                it('should discard 1 card', function () {
                    this.chatCommands.executeCommand(this.playerSpy, '/discard', [
                        '/discard',
                        '-1'
                    ]);

                    expect(this.playerSpy.discardAtRandom).toHaveBeenCalledWith(1);
                });
            });

            describe('with a valid argument', function () {
                it('should discard the passed amount of cards', function () {
                    this.chatCommands.executeCommand(this.playerSpy, '/discard', ['/discard', '3']);

                    expect(this.playerSpy.discardAtRandom).toHaveBeenCalledWith(3);
                });
            });
        });

        describe('with a /pillage command', function () {
            describe('with no arguments', function () {
                it('should discard 1 card', function () {
                    this.chatCommands.executeCommand(this.playerSpy, '/pillage', ['/pillage']);

                    expect(this.playerSpy.discardFromDraw).toHaveBeenCalledWith(
                        1,
                        jasmine.any(Function)
                    );
                });
            });
        });
    });
});
