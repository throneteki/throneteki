import Player from '../../../server/game/player.js';
import DrawCard from '../../../server/game/drawcard.js';

describe('Player', function () {
    describe('moveCard', function () {
        beforeEach(function () {
            this.gameSpy = jasmine.createSpyObj('game', ['raiseEvent', 'on']);
            this.player = new Player(
                '1',
                { username: 'Player 1', settings: {} },
                true,
                this.gameSpy
            );
            this.player.initialise();

            this.gameSpy.raiseEvent.and.callFake((name, params, handler) => {
                if (handler) {
                    handler(params);
                }
            });
            this.card = new DrawCard(this.player, { code: '1', name: 'Test' });
            spyOn(this.card, 'leavesPlay');
        });

        describe('when the card is not in a pile', function () {
            beforeEach(function () {
                this.card.location = '';
            });

            it('should add the card to the player hand', function () {
                this.player.moveCard(this.card, 'hand');
                expect(this.player.hand).toContain(this.card);
                expect(this.card.location).toBe('hand');
            });

            it('should add the card to the player discard pile', function () {
                this.player.moveCard(this.card, 'discard pile');
                expect(this.player.discardPile).toContain(this.card);
                expect(this.card.location).toBe('discard pile');
            });

            it('should add the card to the player dead pile', function () {
                this.player.moveCard(this.card, 'dead pile');
                expect(this.player.deadPile).toContain(this.card);
                expect(this.card.location).toBe('dead pile');
            });

            it('should add the card to the player play area', function () {
                this.player.moveCard(this.card, 'play area');
                expect(this.player.cardsInPlay).toContain(this.card);
                expect(this.card.location).toBe('play area');
            });
        });

        describe('when the card is in a non-play-area pile', function () {
            beforeEach(function () {
                this.player.discardPile.push(this.card);
                this.card.location = 'discard pile';

                this.player.moveCard(this.card, 'hand');
            });

            it('should move it to the target pile', function () {
                expect(this.player.hand).toContain(this.card);
            });

            it('should remove it from the original pile', function () {
                expect(this.player.discardPile).not.toContain(this.card);
            });

            it('should not make the card leave play', function () {
                expect(this.card.leavesPlay).not.toHaveBeenCalled();
            });

            it('should not to raise the left play event', function () {
                expect(this.gameSpy.raiseEvent).not.toHaveBeenCalledWith(
                    'onCardLeftPlay',
                    jasmine.any(Object),
                    jasmine.any(Object)
                );
            });
        });

        describe('when the card is in the play area', function () {
            beforeEach(function () {
                this.player.cardsInPlay.push(this.card);
                this.card.location = 'play area';
            });

            it('should make the card leave play', function () {
                this.player.moveCard(this.card, 'dead pile');
                expect(this.card.leavesPlay).toHaveBeenCalled();
            });

            it('should raise the left play event', function () {
                this.player.moveCard(this.card, 'dead pile');
                expect(this.gameSpy.raiseEvent).toHaveBeenCalled();
            });

            describe('when the card has attachments', function () {
                beforeEach(function () {
                    this.attachment = new DrawCard(this.player, {});
                    this.attachment.parent = this.card;
                    this.attachment.location = 'play area';
                    this.card.attachments.push(this.attachment);
                    spyOn(this.player, 'removeAttachment');

                    this.player.moveCard(this.card, 'hand');
                });

                it('should remove the attachments', function () {
                    expect(this.player.removeAttachment).toHaveBeenCalledWith(
                        this.attachment,
                        false
                    );
                });
            });

            describe('when the card is an attachment', function () {
                beforeEach(function () {
                    this.attachment = new DrawCard(this.player, {});
                    this.attachment.parent = this.card;
                    this.attachment.location = 'play area';
                    this.card.attachments.push(this.attachment);
                    spyOn(this.player, 'removeAttachment');

                    this.player.moveCard(this.attachment, 'hand');
                });

                it('should place the attachment in the target pile', function () {
                    expect(this.player.hand).toContain(this.attachment);
                    expect(this.attachment.location).toBe('hand');
                });

                it('should remove the attachment from the card', function () {
                    expect(this.card.attachments).not.toContain(this.attachment);
                });
            });

            describe('when the card has duplicates', function () {
                beforeEach(function () {
                    this.dupe = new DrawCard(this.player, {});
                    this.card.addDuplicate(this.dupe);

                    spyOn(this.player, 'discardCards');

                    this.player.moveCard(this.card, 'hand');
                });

                it('should discard the dupes', function () {
                    expect(this.player.discardCards).toHaveBeenCalledWith([this.dupe], false);
                });
            });
        });

        describe('when the target location is the draw deck', function () {
            beforeEach(function () {
                this.player.drawDeck = [{}, {}, {}];
            });

            it('should add the card to the top of the deck', function () {
                this.player.moveCard(this.card, 'draw deck');
                expect(this.player.drawDeck[0]).toBe(this.card);
            });

            it('should add the card to the bottom of the deck when the option is passed', function () {
                this.player.moveCard(this.card, 'draw deck', { bottom: true });
                expect(this.player.drawDeck.slice(-1)[0]).toBe(this.card);
            });

            it('should be able to move a card from top to bottom of the deck', function () {
                this.player.drawDeck = [this.card, {}, {}, {}];
                this.card.location = 'draw deck';
                this.player.moveCard(this.card, 'draw deck', { bottom: true });
                expect(this.player.drawDeck.length).toBe(4);
                expect(this.player.drawDeck.slice(-1)[0]).toBe(this.card);
            });
        });

        describe('when the target location is the active plot', function () {
            it('should set the card as the active plot', function () {
                this.player.moveCard(this.card, 'active plot');
                expect(this.player.activePlot).toBe(this.card);
            });
        });

        describe('when moving a controlled card', function () {
            beforeEach(function () {
                this.options = { options: 1 };
                this.callback = jasmine.createSpy('callback');
                this.opponent = new Player(
                    '2',
                    { username: 'Player 2', settings: {} },
                    true,
                    this.gameSpy
                );
                spyOn(this.opponent, 'moveCard');
                this.card.owner = this.opponent;
            });

            describe('from out-of-play to in-play', function () {
                beforeEach(function () {
                    this.card.location = 'discard pile';
                    this.player.moveCard(this.card, 'play area');
                });

                it("should not use the owner's moveCard", function () {
                    expect(this.opponent.moveCard).not.toHaveBeenCalled();
                });
            });

            describe('from in-play to out-of-play', function () {
                beforeEach(function () {
                    this.card.location = 'play area';

                    this.player.moveCard(this.card, 'discard pile', this.options, this.callback);
                });

                it("should use the owner's moveCard instead", function () {
                    expect(this.opponent.moveCard).toHaveBeenCalledWith(
                        this.card,
                        'discard pile',
                        jasmine.objectContaining(this.options),
                        this.callback
                    );
                });
            });

            describe('from out-of-play to out-of-play', function () {
                beforeEach(function () {
                    this.card.location = 'discard pile';

                    this.player.moveCard(this.card, 'hand', this.options, this.callback);
                });

                it("should use the owner's moveCard instead", function () {
                    expect(this.opponent.moveCard).toHaveBeenCalledWith(
                        this.card,
                        'hand',
                        jasmine.objectContaining(this.options),
                        this.callback
                    );
                });
            });
        });
    });
});
