import DrawCard from '../../../server/game/drawcard.js';

describe('DrawCard', function () {
    beforeEach(function () {
        this.owner = {
            game: jasmine.createSpyObj('game', ['raiseEvent'])
        };
    });

    describe('canAttach()', function () {
        describe('when the card is an attachment', function () {
            beforeEach(function () {
                this.targetCard = new DrawCard(this.owner, { type: 'character' });
                this.targetCard.location = 'play area';
                this.attachment = new DrawCard(this.owner, { type: 'attachment' });
            });

            it('should return true', function () {
                expect(this.attachment.canAttach(this.player, this.targetCard)).toBe(true);
            });

            describe('when the target card is not a character', function () {
                beforeEach(function () {
                    spyOn(this.targetCard, 'getType').and.returnValue('location');
                });

                it('should return false', function () {
                    expect(this.attachment.canAttach(this.player, this.targetCard)).toBe(false);
                });
            });

            describe('when custom restrictions are added', function () {
                beforeEach(function () {
                    this.matcherSpy = jasmine.createSpy('matcher');
                    this.attachment.attachmentRestriction(this.matcherSpy);
                });

                it('should call the matcher', function () {
                    this.attachment.canAttach(this.player, this.targetCard);
                    expect(this.matcherSpy).toHaveBeenCalledWith(
                        this.targetCard,
                        jasmine.objectContaining({ player: this.player })
                    );
                });

                it('should return the result of the matcher', function () {
                    this.matcherSpy.and.returnValue(true);
                    expect(this.attachment.canAttach(this.player, this.targetCard)).toBe(true);
                });
            });
        });

        describe('when the card is not an attachment', function () {
            beforeEach(function () {
                this.targetCard = new DrawCard(this.owner, { text: '' });
                this.attachment = new DrawCard(this.owner, { type: 'event' });
            });

            it('should return false', function () {
                expect(this.attachment.canAttach(this.player, this.targetCard)).toBe(false);
            });
        });
    });

    describe('allowAttachment()', function () {
        describe('when the target card does not allow attachments', function () {
            beforeEach(function () {
                this.targetCard = new DrawCard(this.owner, {});
                this.attachment = new DrawCard(this.owner, { type: 'attachment' });

                this.targetCard.addKeyword('No attachments');
            });

            it('should return false', function () {
                expect(this.targetCard.allowAttachment(this.attachment)).toBe(false);
            });
        });

        describe('when the target card only allows certain kinds of attachments', function () {
            beforeEach(function () {
                this.targetCard = new DrawCard(this.owner, {});
                this.targetCard.addKeyword('No attachments except <i>Weapon</i>');
            });

            describe('and the attachment has that trait', function () {
                beforeEach(function () {
                    this.attachment = new DrawCard(this.owner, {
                        type: 'attachment',
                        traits: ['Condition', 'Weapon']
                    });
                });

                it('should return true', function () {
                    expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
                });
            });

            describe('and the attachment does not have that trait', function () {
                beforeEach(function () {
                    this.attachment = new DrawCard(this.owner, {
                        type: 'attachment',
                        traits: ['Condition']
                    });
                });

                it('should return false', function () {
                    expect(this.targetCard.allowAttachment(this.attachment)).toBe(false);
                });
            });
        });

        describe('when there are no restrictions', function () {
            beforeEach(function () {
                this.targetCard = new DrawCard(this.owner, { text: '' });
                this.attachment = new DrawCard(this.owner, { type: 'attachment', traits: [] });
            });

            it('should return true', function () {
                expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
            });
        });
    });
});
