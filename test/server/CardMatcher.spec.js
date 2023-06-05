const CardMatcher = require('../../server/game/CardMatcher.js');

describe('CardMatcher', function() {
    beforeEach(function() {
        this.cardSpy = jasmine.createSpyObj('card', ['getType', 'hasTrait', 'isAttacking', 'isDefending', 'isParticipating', 'isUnique', 'isLimited', 'isLoyal']);
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

    describe('createCardAttributeAnalyzer', function() {
        beforeEach(function() {
            let controller = { controller: 1 };
            this.context = { player: controller };
        });

        describe('defaults', function() {
            beforeEach(function() {
                this.analyze = CardMatcher.createCardAttributeAnalyzer({});
            });

            it('should return false when nothing is checked', function() {
                expect(this.analyze(this.cardSpy, this.context)).toBe(false);
            });
        });

        describe('card attributes', function() {
            beforeEach(function() {
                this.cardSpy.cardData = { type: 'character' };
                this.cardSpy.name = 'Card';
                this.cardSpy.location = 'hand';
                this.cardSpy.traits = {
                    contains: (trait) => ['Lady'].includes(trait)
                };
                // Need to 'strictly' define function to ensure it's scope is within the proxy 
                // created in the checker (eg. "this" will refer to the proxy, rather than this test's context)
                this.cardSpy.getType.and.callFake(function() {
                    return this.cardData.type;
                });
                this.cardSpy.hasTrait.and.callFake(function(trait) {
                    return this.traits.contains(trait);
                });
            });

            it('should return true when primitive property attributes are accessed (eg. name)', function() {
                this.analyze = CardMatcher.createCardAttributeAnalyzer({ name: 'Card' });
                expect(this.analyze(this.cardSpy, this.context)).toBe(true);
            });

            it('should return true when cardData is accessed, even through methods (eg. getType)', function() {
                this.analyze = CardMatcher.createCardAttributeAnalyzer({ type: 'character' });
                expect(this.analyze(this.cardSpy, this.context)).toBe(true);
            });

            it('should return true when object-based attributes are accessed (eg. traits)', function() {
                this.analyze = CardMatcher.createCardAttributeAnalyzer({ trait: 'Lord' });
                expect(this.analyze(this.cardSpy, this.context)).toBe(true);
            });

            it('should return false if only gamestate properties for the card are accessed (eg. location)', function() {
                this.analyze = CardMatcher.createCardAttributeAnalyzer({ location: 'hand' });
                expect(this.analyze(this.cardSpy, this.context)).toBe(false);
            });

            it('should return true if multiple properties are accessed, and one or more are attributes', function() {
                this.analyze = CardMatcher.createCardAttributeAnalyzer({ name: 'Card', type: 'character', location: 'hand' });
                expect(this.analyze(this.cardSpy, this.context)).toBe(true);
            });

            it('should return true if attributes are accessed through a matching function', function() {
                this.analyze = CardMatcher.createCardAttributeAnalyzer((card, context) => card.getType() === 'character' && card.controller === context.controller);
                expect(this.analyze(this.cardSpy, this.context)).toBe(true);
            });
        });
    });
});
