const CardMatcher = require('../../server/game/CardMatcher.js');

describe('CardMatcher', function() {
    beforeEach(function() {
        this.cardSpy = jasmine.createSpyObj('card', ['getType', 'isAttacking', 'isDefending', 'isParticipating', 'isUnique', 'isLimited', 'isLoyal']);
    });

    describe('.isMatch', function() {
        describe('attacking', function() {
            it('returns true if the card is attacking', function() {
                this.cardSpy.isAttacking.and.returnValue(true);
                expect(CardMatcher.isMatch(this.cardSpy, { attacking: true })).toBe(true);
            });

            it('returns false if the card is not attacking', function() {
                this.cardSpy.isAttacking.and.returnValue(false);
                expect(CardMatcher.isMatch(this.cardSpy, { attacking: true })).toBe(false);
            });
        });

        describe('defending', function() {
            it('returns true if the card is defending', function() {
                this.cardSpy.isDefending.and.returnValue(true);
                expect(CardMatcher.isMatch(this.cardSpy, { defending: true })).toBe(true);
            });

            it('returns false if the card is not defending', function() {
                this.cardSpy.isDefending.and.returnValue(false);
                expect(CardMatcher.isMatch(this.cardSpy, { defending: true })).toBe(false);
            });
        });

        describe('participating', function() {
            it('returns true if the card is participating', function() {
                this.cardSpy.isParticipating.and.returnValue(true);
                expect(CardMatcher.isMatch(this.cardSpy, { participating: true })).toBe(true);
            });

            it('returns false if the card is not participating', function() {
                this.cardSpy.isParticipating.and.returnValue(false);
                expect(CardMatcher.isMatch(this.cardSpy, { participating: true })).toBe(false);
            });
        });
    });

    describe('createAttachmentMatcher', function() {
        beforeEach(function() {
            let controller = { controller: 1 };
            this.context = { player: controller };
            this.cardSpy.controller = controller;
            this.cardSpy.getType.and.returnValue('character');
        });

        describe('defaults', function() {
            beforeEach(function() {
                this.matcher = CardMatcher.createAttachmentMatcher({});
            });

            it('should match characters', function() {
                expect(this.matcher(this.cardSpy, this.context)).toBe(true);
            });

            it('should not match non-characters', function() {
                this.cardSpy.getType.and.returnValue('location');
                expect(this.matcher(this.cardSpy, this.context)).toBe(false);
            });
        });

        describe('controller', function() {
            describe('when a specific value', function() {
                beforeEach(function() {
                    this.controller = { controller: 1 };
                    this.matcher = CardMatcher.createAttachmentMatcher({ controller: this.controller });
                });

                it('should return true when it matches', function() {
                    this.cardSpy.controller = this.controller;
                    expect(this.matcher(this.cardSpy, this.context)).toBe(true);
                });

                it('should return false when it does not match', function() {
                    this.cardSpy.controller = { controller: 2 };
                    expect(this.matcher(this.cardSpy, this.context)).toBe(false);
                });
            });

            describe('when the value is \'current\'', function() {
                beforeEach(function() {
                    this.matcher = CardMatcher.createAttachmentMatcher({ controller: 'current' });
                });

                it('should return true when the controller is the same as the context player', function() {
                    this.cardSpy.controller = this.context.player;
                    expect(this.matcher(this.cardSpy, this.context)).toBe(true);
                });

                it('should return false when the controller is different from the context player', function() {
                    this.cardSpy.controller = { controller: 2 };
                    expect(this.matcher(this.cardSpy, this.context)).toBe(false);
                });
            });

            describe('when the value is \'opponent\'', function() {
                beforeEach(function() {
                    this.matcher = CardMatcher.createAttachmentMatcher({ controller: 'opponent' });
                });

                it('should return false when the controller is the same as the context player', function() {
                    this.cardSpy.controller = this.context.player;
                    expect(this.matcher(this.cardSpy, this.context)).toBe(false);
                });

                it('should return true when the controller is different from the context player', function() {
                    this.cardSpy.controller = { controller: 2 };
                    expect(this.matcher(this.cardSpy, this.context)).toBe(true);
                });
            });
        });
    });
});
