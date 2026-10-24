import DropCommand from '../../../server/game/ServerCommands/DropCommand.js';

describe('DropCommand', () => {
    describe('execute()', function () {
        beforeEach(function () {
            this.gameSpy = { addAlert: vi.fn(), killCharacter: vi.fn() };
            this.playerSpy = { discardCard: vi.fn(), moveCard: vi.fn(), putIntoPlay: vi.fn() };

            this.cardSpy = { allowGameAction: vi.fn(), getType: vi.fn() };
            this.cardSpy.allowGameAction.mockReturnValue(true);
            this.cardSpy.controller = this.cardSpy.owner = this.playerSpy;
            this.cardSpy.getType.mockReturnValue('character');
            this.cardSpy.location = 'hand';

            this.executeForLocation = (targetLocation) => {
                let command = new DropCommand(
                    this.gameSpy,
                    this.playerSpy,
                    this.cardSpy,
                    targetLocation
                );
                command.execute();
            };
        });

        describe('when dragging a card to play area', function () {
            for (let type of ['attachment', 'character', 'location']) {
                describe(`when the card is a ${type}`, function () {
                    beforeEach(function () {
                        this.cardSpy.getType.mockReturnValue(type);

                        this.executeForLocation('play area');
                    });

                    it('should add the card to the play area', function () {
                        expect(this.playerSpy.putIntoPlay).toHaveBeenCalledWith(
                            this.cardSpy,
                            'play',
                            expect.objectContaining({ force: true })
                        );
                    });
                });
            }

            describe('during setup', function () {
                beforeEach(function () {
                    this.gameSpy.currentPhase = 'setup';

                    this.executeForLocation('play area');
                });

                it('should set the card up', function () {
                    expect(this.playerSpy.putIntoPlay).toHaveBeenCalledWith(
                        this.cardSpy,
                        'setup',
                        expect.objectContaining({ force: true })
                    );
                });
            });

            describe('when the card is in hand and an event', function () {
                beforeEach(function () {
                    this.cardSpy.getType.mockReturnValue('event');

                    this.executeForLocation('play area');
                });

                it('should not add the card to the play area', function () {
                    expect(this.playerSpy.putIntoPlay).not.toHaveBeenCalled();
                });
            });
        });

        describe('when dragging a card to the dead pile', function () {
            for (let type of ['attachment', 'event', 'location']) {
                describe(`when the card is a ${type}`, function () {
                    beforeEach(function () {
                        this.cardSpy.getType.mockReturnValue(type);

                        this.executeForLocation('dead pile');
                    });

                    it('should not move the card', function () {
                        expect(this.playerSpy.moveCard).not.toHaveBeenCalled();
                    });
                });
            }

            describe('when the card is a character', function () {
                beforeEach(function () {
                    this.cardSpy.getType.mockReturnValue('character');
                });

                describe('and the character is not in play', function () {
                    beforeEach(function () {
                        this.cardSpy.location = 'hand';

                        this.executeForLocation('dead pile');
                    });

                    it('should move the card directly', function () {
                        expect(this.playerSpy.moveCard).toHaveBeenCalledWith(
                            this.cardSpy,
                            'dead pile'
                        );
                    });

                    it('should not kill the card', function () {
                        expect(this.gameSpy.killCharacter).not.toHaveBeenCalled();
                    });
                });

                describe('and the character is in play', function () {
                    beforeEach(function () {
                        this.cardSpy.location = 'play area';

                        this.executeForLocation('dead pile');
                    });

                    it('should kill the character', function () {
                        expect(this.gameSpy.killCharacter).toHaveBeenCalledWith(
                            this.cardSpy,
                            expect.objectContaining({ allowSave: false, force: true })
                        );
                    });
                });
            });
        });

        describe('when dragging a card to the discard pile', function () {
            for (let type of ['attachment', 'character', 'event', 'location']) {
                describe(`when the card is a ${type}`, function () {
                    beforeEach(function () {
                        this.cardSpy.getType.mockReturnValue(type);
                    });

                    describe('and it is not in play', function () {
                        beforeEach(function () {
                            this.cardSpy.location = 'dead pile';
                            this.executeForLocation('discard pile');
                        });

                        it('should move the card directly', function () {
                            expect(this.playerSpy.moveCard).toHaveBeenCalledWith(
                                this.cardSpy,
                                'discard pile'
                            );
                        });

                        it('should not discard the card', function () {
                            expect(this.playerSpy.discardCard).not.toHaveBeenCalled();
                        });
                    });

                    describe('and it is in play', function () {
                        beforeEach(function () {
                            this.cardSpy.location = 'play area';
                            this.executeForLocation('discard pile');
                        });

                        it('should discard the card', function () {
                            expect(this.playerSpy.discardCard).toHaveBeenCalledWith(
                                this.cardSpy,
                                false,
                                expect.objectContaining({ force: true })
                            );
                        });
                    });
                });
            }
        });

        describe('when dragging a card to the deck', function () {
            for (let type of ['attachment', 'character', 'event', 'location']) {
                describe(`when the card is a ${type}`, function () {
                    beforeEach(function () {
                        this.cardSpy.getType.mockReturnValue(type);

                        this.executeForLocation('draw deck');
                    });

                    it('should discard the card', function () {
                        expect(this.playerSpy.moveCard).toHaveBeenCalledWith(
                            this.cardSpy,
                            'draw deck'
                        );
                    });
                });
            }
        });
    });
});
