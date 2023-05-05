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

    describe('createCardCharacteristicChecker', function() {
        beforeEach(function() {
            let controller = { controller: 1 };
            this.context = { player: controller };
        });

        describe('defaults', function() {
            beforeEach(function() {
                this.checker = CardMatcher.createCardCharacteristicChecker({});
            });

            it('should return false when nothing is checked', function() {
                expect(this.checker(this.cardSpy, this.context)).toBe(false);
            });
        });

        describe('characteristics', function() {
            beforeEach(function() {
                this.cardSpy.cardData = { type: 'character' };
                this.cardSpy.name = 'Card';
                this.cardSpy.location = 'hand';
                // Need to 'strictly' define function to ensure it's scope is within the proxy 
                // created in the checker (eg. "this" will refer to the proxy, rather than this test's context)
                this.cardSpy.getType.and.callFake(function() {
                    return this.cardData.type;
                });
            });

            it('should return true when primitive property characteristics are checked (eg. name)', function() {
                this.checker = CardMatcher.createCardCharacteristicChecker({ name: 'Card' });
                expect(this.checker(this.cardSpy, this.context)).toBe(true);
            });

            it('should return true when cardData characteristics are checked, even through methods (eg. getType)', function() {
                this.checker = CardMatcher.createCardCharacteristicChecker({ type: 'character' });
                expect(this.checker(this.cardSpy, this.context)).toBe(true);
            });

            it('should return false if only gamestate properties for the card are checked (eg. location)', function() {
                this.checker = CardMatcher.createCardCharacteristicChecker({ location: 'hand' });
                expect(this.checker(this.cardSpy, this.context)).toBe(false);
            });

            it('should return true if multiple properties are checked, and one or more are characteristics', function() {
                this.checker = CardMatcher.createCardCharacteristicChecker({ name: 'Card', type: 'character', location: 'hand' });
                expect(this.checker(this.cardSpy, this.context)).toBe(true);
            });

            it('should return true if characteristics are checked through a matching function', function() {
                this.checker = CardMatcher.createCardCharacteristicChecker((card, context) => card.getType() === 'character' && card.controller === context.controller);
                expect(this.checker(this.cardSpy, this.context)).toBe(true);
            });
        });
    });
});
