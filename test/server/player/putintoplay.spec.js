import Player from '../../../server/game/player.js';

describe('Player', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', [
            'queueSimpleStep',
            'queueStep',
            'raiseEvent',
            'resolveEvent'
        ]);
        this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
        this.player.initialise();

        spyOn(this.player, 'getDuplicateInPlay');
        spyOn(this.player, 'isCharacterDead');
        spyOn(this.player, 'canResurrect');

        this.gameSpy.queueSimpleStep.and.callFake((func) => func());

        this.cardSpy = jasmine.createSpyObj('card', [
            'getPrintedType',
            'getCost',
            'isBestow',
            'isUnique',
            'applyPersistentEffects',
            'moveTo',
            'takeControl'
        ]);
        this.cardSpy.controller = this.player;
        this.cardSpy.owner = this.player;
        this.dupeCardSpy = jasmine.createSpyObj('dupecard', ['addDuplicate']);
        this.player.hand.push(this.cardSpy);
        this.cardSpy.location = 'hand';
    });

    describe('putIntoPlay', function () {
        describe('when the playing type is marshal', function () {
            describe('and the card is not a duplicate', function () {
                beforeEach(function () {
                    this.player.getDuplicateInPlay.and.returnValue(null);
                    this.player.putIntoPlay(this.cardSpy, 'marshal');
                });

                it('should add the card to cards in play', function () {
                    expect(this.player.cardsInPlay).toContain(this.cardSpy);
                });

                it('should be placed face up', function () {
                    expect(this.cardSpy.facedown).toBe(false);
                });

                it('should be marked as new', function () {
                    expect(this.cardSpy.new).toBe(true);
                });

                it('should apply effects for the card', function () {
                    expect(this.cardSpy.applyPersistentEffects).toHaveBeenCalled();
                });

                it('should raise the onCardEntersPlay event', function () {
                    expect(this.gameSpy.resolveEvent).toHaveBeenCalledWith(
                        jasmine.objectContaining({
                            name: 'onCardEntersPlay',
                            card: this.cardSpy,
                            playingType: 'marshal'
                        })
                    );
                });

                describe('when it has the Bestow keyword', function () {
                    beforeEach(function () {
                        this.cardSpy.isBestow.and.returnValue(true);
                        this.player.putIntoPlay(this.cardSpy, 'marshal');
                    });

                    it('should queue the bestow prompt', function () {
                        expect(this.gameSpy.queueStep).toHaveBeenCalled();
                        expect(
                            this.gameSpy.queueStep.calls.mostRecent().args[0].constructor.name
                        ).toBe('BestowPrompt');
                    });
                });
            });

            describe('and the card is a duplicate', function () {
                beforeEach(function () {
                    this.player.getDuplicateInPlay.and.returnValue(this.dupeCardSpy);
                    this.player.putIntoPlay(this.cardSpy, 'marshal');
                });

                it('should not add the card to cards in play', function () {
                    expect(this.player.cardsInPlay).not.toContain(this.cardSpy);
                });

                it('should not apply effects for the card', function () {
                    expect(this.cardSpy.applyPersistentEffects).not.toHaveBeenCalled();
                });

                it('should not raise the onCardEntersPlay event', function () {
                    expect(this.gameSpy.raiseEvent).not.toHaveBeenCalledWith(
                        'onCardEntersPlay',
                        jasmine.objectContaining({ card: this.cardSpy })
                    );
                });

                it('should add as a duplicate', function () {
                    expect(this.dupeCardSpy.addDuplicate).toHaveBeenCalledWith(this.cardSpy);
                });

                describe('when it has the Bestow keyword', function () {
                    beforeEach(function () {
                        this.cardSpy.isBestow.and.returnValue(true);
                        this.player.putIntoPlay(this.cardSpy, 'marshal');
                    });

                    it('should not queue the bestow prompt', function () {
                        expect(this.gameSpy.queueStep).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('when card is an attachment', function () {
            beforeEach(function () {
                spyOn(this.player, 'promptForAttachment');

                this.cardSpy.getPrintedType.and.returnValue('attachment');
            });

            describe('and there is no duplicate out', function () {
                beforeEach(function () {
                    this.player.getDuplicateInPlay.and.returnValue(null);
                    this.player.putIntoPlay(this.cardSpy, 'marshal');
                });

                it('should prompt for attachment target', function () {
                    expect(this.player.promptForAttachment).toHaveBeenCalled();
                });

                it('should not remove the card from hand', function () {
                    expect(this.player.hand).toContain(this.cardSpy);
                });
            });

            describe('and there is a duplicate out', function () {
                beforeEach(function () {
                    this.player.getDuplicateInPlay.and.returnValue(this.dupeCardSpy);
                    this.player.putIntoPlay(this.cardSpy, 'marshal');
                });

                it('should not prompt for attachment target', function () {
                    expect(this.player.promptForAttachment).not.toHaveBeenCalled();
                });

                it('should remove the card from hand', function () {
                    expect(this.player.hand).not.toContain(this.cardSpy);
                });

                it('should add a duplicate to the existing card in play', function () {
                    expect(this.dupeCardSpy.addDuplicate).toHaveBeenCalledWith(this.cardSpy);
                });

                it('should not add a new card to play', function () {
                    expect(this.player.cardsInPlay).not.toContain(this.cardSpy);
                });
            });
        });

        describe('when the playing type is setup', function () {
            describe('and the card is not a duplicate', function () {
                beforeEach(function () {
                    this.player.getDuplicateInPlay.and.returnValue(null);
                    this.gameSpy.currentPhase = 'setup';
                    this.player.putIntoPlay(this.cardSpy, 'setup');
                });

                it('should add the card to cards in play', function () {
                    expect(this.player.cardsInPlay).toContain(this.cardSpy);
                });

                it('should be placed face down', function () {
                    expect(this.cardSpy.facedown).toBe(true);
                });

                it('should be marked as new', function () {
                    expect(this.cardSpy.new).toBe(true);
                });

                it('should apply effects for the card', function () {
                    expect(this.cardSpy.applyPersistentEffects).toHaveBeenCalledWith();
                });

                it('should raise the onCardEntersPlay event', function () {
                    expect(this.gameSpy.resolveEvent).toHaveBeenCalledWith(
                        jasmine.objectContaining({
                            name: 'onCardEntersPlay',
                            card: this.cardSpy,
                            playingType: 'setup'
                        })
                    );
                });

                describe('when it has the Bestow keyword', function () {
                    beforeEach(function () {
                        this.cardSpy.isBestow.and.returnValue(true);
                        this.player.putIntoPlay(this.cardSpy, 'setup');
                    });

                    it('should not queue the bestow prompt', function () {
                        expect(this.gameSpy.queueStep).not.toHaveBeenCalled();
                    });
                });
            });

            describe('and the card is a duplicate', function () {
                beforeEach(function () {
                    this.player.getDuplicateInPlay.and.returnValue(this.dupeCardSpy);
                    this.gameSpy.currentPhase = 'setup';
                    this.player.putIntoPlay(this.cardSpy, 'setup');
                });

                it('should add the card to cards in play', function () {
                    expect(this.player.cardsInPlay).toContain(this.cardSpy);
                });

                it('should be placed face down', function () {
                    expect(this.cardSpy.facedown).toBe(true);
                });

                it('should be marked as new', function () {
                    expect(this.cardSpy.new).toBe(true);
                });

                it('should not apply effects for the card', function () {
                    expect(this.cardSpy.applyPersistentEffects).not.toHaveBeenCalled();
                });

                it('should raise the onCardEntersPlay event', function () {
                    expect(this.gameSpy.resolveEvent).toHaveBeenCalledWith(
                        jasmine.objectContaining({
                            name: 'onCardEntersPlay',
                            card: this.cardSpy,
                            playingType: 'setup'
                        })
                    );
                });

                it('should not add as a duplicate', function () {
                    expect(this.dupeCardSpy.addDuplicate).not.toHaveBeenCalledWith(this.cardSpy);
                });
            });
        });

        describe('when the playing type is ambush', function () {
            describe('and the card is not a duplicate', function () {
                beforeEach(function () {
                    this.player.getDuplicateInPlay.and.returnValue(null);
                    this.player.putIntoPlay(this.cardSpy, 'ambush');
                });

                it('should add the card to cards in play', function () {
                    expect(this.player.cardsInPlay).toContain(this.cardSpy);
                });

                it('should be placed face up', function () {
                    expect(this.cardSpy.facedown).toBe(false);
                });

                it('should be marked as new', function () {
                    expect(this.cardSpy.new).toBe(true);
                });

                it('should apply effects for the card', function () {
                    expect(this.cardSpy.applyPersistentEffects).toHaveBeenCalled();
                });

                it('should raise the onCardEntersPlay event', function () {
                    expect(this.gameSpy.resolveEvent).toHaveBeenCalledWith(
                        jasmine.objectContaining({
                            name: 'onCardEntersPlay',
                            card: this.cardSpy,
                            playingType: 'ambush'
                        })
                    );
                });
            });

            describe('and the card is a duplicate', function () {
                beforeEach(function () {
                    this.player.getDuplicateInPlay.and.returnValue(this.dupeCardSpy);
                    this.player.putIntoPlay(this.cardSpy, 'ambush');
                });

                it('should not add the card to cards in play', function () {
                    expect(this.player.cardsInPlay).not.toContain(this.cardSpy);
                });

                it('should not apply effects for the card', function () {
                    expect(this.cardSpy.applyPersistentEffects).not.toHaveBeenCalled();
                });

                it('should not raise the onCardEntersPlay event', function () {
                    expect(this.gameSpy.raiseEvent).not.toHaveBeenCalledWith(
                        'onCardEntersPlay',
                        jasmine.objectContaining({ card: this.cardSpy })
                    );
                });

                it('should add as a duplicate', function () {
                    expect(this.dupeCardSpy.addDuplicate).toHaveBeenCalledWith(this.cardSpy);
                });
            });
        });

        describe('when the card is not controlled by the player', function () {
            beforeEach(function () {
                this.opponent = new Player(
                    '2',
                    { username: 'Player 2', settings: {} },
                    true,
                    this.gameSpy
                );
                this.opponent.initialise();
                spyOn(this.opponent, 'getDuplicateInPlay');
                spyOn(this.opponent, 'isCharacterDead');
                spyOn(this.opponent, 'canResurrect');
                this.cardSpy.controller = this.opponent;
                this.cardSpy.owner = this.opponent;
                this.opponent.hand.push(this.cardSpy);
                this.player.hand = [];

                this.player.putIntoPlay(this.cardSpy, 'marshal');
            });

            it('should add the card to cards in play', function () {
                expect(this.player.cardsInPlay).toContain(this.cardSpy);
            });

            it('should remove the card from the other player', function () {
                expect(this.opponent.hand).not.toContain(this.cardSpy);
            });

            it('should transfer control to the player', function () {
                expect(this.cardSpy.takeControl).toHaveBeenCalledWith(this.player);
            });
        });
    });
});
