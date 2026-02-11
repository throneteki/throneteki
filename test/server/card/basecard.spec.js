import BaseCard from '../../../server/game/basecard.js';
import { Flags } from '../../../server/game/Constants/index.js';

describe('BaseCard', function () {
    beforeEach(function () {
        this.testCard = {
            code: '111',
            label: 'test 1(some pack)',
            name: 'test 1',
            faction: 'neutral'
        };
        this.limitedCard = { code: '1234', text: 'Limited.', faction: 'neutral' };
        this.nonLimitedCard = { code: '2222', text: 'Stealth.', faction: 'neutral' };
        this.game = jasmine.createSpyObj('game', ['isCardVisible', 'raiseEvent']);
        this.owner = jasmine.createSpyObj('owner', ['getCardSelectionState', 'isSpectator']);
        this.owner.getCardSelectionState.and.returnValue({});
        this.owner.game = this.game;
        this.card = new BaseCard(this.owner, this.testCard);
    });

    describe('when new instance created', function () {
        it('should generate a new uuid', function () {
            expect(this.card.uuid).not.toBeUndefined();
        });
    });

    describe('.parseKeywords', function () {
        it('parses keywords with a parenthesized value', function () {
            const keywords = BaseCard.parseKeywords('Ambush (1). Bestow (2). Shadow (3).');
            expect(keywords.length).toBe(3);
            expect(keywords).toContain('ambush (1)');
            expect(keywords).toContain('bestow (2)');
            expect(keywords).toContain('shadow (3)');
        });

        it('parses non-value keywords', function () {
            const keywords = BaseCard.parseKeywords(
                'Stealth. Intimidate. Renown. Insight. Terminal. Limited. Pillage.'
            );

            expect(keywords.length).toBe(7);
            expect(keywords).toContain('stealth');
            expect(keywords).toContain('intimidate');
            expect(keywords).toContain('renown');
            expect(keywords).toContain('insight');
            expect(keywords).toContain('terminal');
            expect(keywords).toContain('limited');
            expect(keywords).toContain('pillage');
        });

        it('parses no attachment keywords', function () {
            const keywords = BaseCard.parseKeywords(
                'No attachments. No attachments except <i>Weapon</i>.'
            );

            expect(keywords.length).toBe(2);
            expect(keywords).toContain('no attachments');
            expect(keywords).toContain('no attachments except <i>weapon</i>');
        });

        it('parses keywords on multiple lines', function () {
            const keywords = BaseCard.parseKeywords(`
                Shadow (4).\n
                No attachments except <i>Weapon</i>.\n
                <b>Action:</b> Until the end of phase, cannot be bypassed by Stealth.
            `);

            expect(keywords.length).toBe(2);
            expect(keywords).toContain('shadow (4)');
            expect(keywords).toContain('no attachments except <i>weapon</i>');
        });

        it('does not parse keywords that are embedded in abilities', function () {
            const keywords = BaseCard.parseKeywords('Cannot be bypassed by stealth.');

            expect(keywords).toEqual([]);
        });
    });

    describe('doAction()', function () {
        describe('when there is no action for the card', function () {
            beforeEach(function () {
                this.card.abilities.actions = [];
            });

            it('does not crash', function () {
                expect(() => this.card.doAction('player', 0)).not.toThrow();
            });
        });

        describe('when there are actions for the card', function () {
            beforeEach(function () {
                this.actionSpy1 = jasmine.createSpyObj('action', ['execute']);
                this.actionSpy2 = jasmine.createSpyObj('action', ['execute']);
                this.card.abilities.actions = [this.actionSpy1, this.actionSpy2];
            });

            it('should call execute on the action with the appropriate index', function () {
                this.card.doAction('player', 1);
                expect(this.actionSpy2.execute).toHaveBeenCalledWith('player', 1);
            });

            it('should handle out of bounds indices', function () {
                this.card.doAction('player', 3);
                expect(this.actionSpy1.execute).not.toHaveBeenCalled();
                expect(this.actionSpy2.execute).not.toHaveBeenCalled();
            });
        });
    });

    describe('getSummary', function () {
        describe('when is visible to the active player', function () {
            beforeEach(function () {
                this.game.isCardVisible.and.returnValue(true);
                this.summary = this.card.getSummary(this.owner);
            });

            describe('and card is faceup', function () {
                it('should return card data', function () {
                    expect(this.summary.uuid).toEqual(this.card.uuid);
                    expect(this.summary.name).toEqual(this.testCard.label);
                    expect(this.summary.code).toEqual(this.testCard.code);
                });

                it('should not return facedown', function () {
                    expect(this.summary.facedown).toBeFalsy();
                });
            });

            describe('and card is facedown', function () {
                beforeEach(function () {
                    this.card.facedown = true;
                    this.summary = this.card.getSummary(this.owner);
                });

                it('should return card data', function () {
                    expect(this.summary.uuid).toEqual(this.card.uuid);
                    expect(this.summary.name).toEqual(this.testCard.label);
                    expect(this.summary.code).toEqual(this.testCard.code);
                });

                it('should return facedown', function () {
                    expect(this.summary.facedown).toBe(true);
                });
            });
        });

        describe('when is not visible to active player', function () {
            beforeEach(function () {
                this.game.isCardVisible.and.returnValue(false);
                this.anotherPlayer = jasmine.createSpyObj('owner', ['getCardSelectionState']);
                this.anotherPlayer.getCardSelectionState.and.returnValue({});
                this.summary = this.card.getSummary(this.anotherPlayer);
            });

            describe('and card is faceup', function () {
                it('should return no card data', function () {
                    expect(this.summary.name).toBeUndefined();
                    expect(this.summary.code).toBeUndefined();
                });

                it('should return the uuid', function () {
                    expect(this.summary.uuid).not.toBeUndefined();
                });

                it('should return facedown', function () {
                    expect(this.summary.facedown).toBe(true);
                });
            });

            describe('and card is facedown', function () {
                beforeEach(function () {
                    this.card.facedown = true;
                    this.summary = this.card.getSummary(this.anotherPlayer);
                });

                it('should return no card data', function () {
                    expect(this.summary.name).toBeUndefined();
                    expect(this.summary.code).toBeUndefined();
                });

                it('should return facedown', function () {
                    expect(this.summary.facedown).toBe(true);
                });

                it('should return the uuid', function () {
                    expect(this.summary.uuid).not.toBeUndefined();
                });
            });
        });
    });

    describe('allowGameAction()', function () {
        describe('when there are no restrictions', function () {
            it('should return true', function () {
                expect(this.card.allowGameAction('kill')).toBe(true);
            });
        });

        describe('when there are restrictions', function () {
            beforeEach(function () {
                this.game.currentAbilityContext = { context: 1 };
                this.restrictionSpy1 = jasmine.createSpyObj('restriction', ['isMatch', 'isActive']);
                this.restrictionSpy1.name = 'restriction1';
                this.restrictionSpy1.isActive.and.returnValue(true);
                this.restrictionSpy2 = jasmine.createSpyObj('restriction', ['isMatch', 'isActive']);
                this.restrictionSpy2.name = 'restriction2';
                this.restrictionSpy2.isActive.and.returnValue(true);
                this.card.addAbilityRestriction(this.restrictionSpy1);
                this.card.addAbilityRestriction(this.restrictionSpy2);
            });

            it('should check each restriction', function () {
                this.card.allowGameAction('kill');
                expect(this.restrictionSpy1.isMatch).toHaveBeenCalledWith(
                    'kill',
                    this.game.currentAbilityContext
                );
                expect(this.restrictionSpy2.isMatch).toHaveBeenCalledWith(
                    'kill',
                    this.game.currentAbilityContext
                );
            });

            describe('and there are no matching restrictions', function () {
                it('should return true', function () {
                    expect(this.card.allowGameAction('kill')).toBe(true);
                });
            });

            describe('and at least one matches', function () {
                beforeEach(function () {
                    this.restrictionSpy2.isMatch.and.returnValue(true);
                });

                it('should return false', function () {
                    expect(this.card.allowGameAction('kill')).toBe(false);
                });
            });

            describe('but a restriction type is lost', function () {
                beforeEach(function () {
                    this.card.flags.add('restriction1');
                    this.restrictionSpy1.isActive.and.callFake(
                        (card) => !card.hasFlag('restriction1')
                    );
                    this.restrictionSpy2.isActive.and.callFake(
                        (card) => !card.hasFlag('restriction2')
                    );
                    this.card.markAsDirty();
                });

                it('should skip that restriction type', function () {
                    this.card.allowGameAction('kill');
                    expect(this.restrictionSpy1.isMatch).not.toHaveBeenCalled();
                    expect(this.restrictionSpy2.isMatch).toHaveBeenCalledWith(
                        'kill',
                        this.game.currentAbilityContext
                    );
                });
            });
        });
    });

    describe('isFaction()', function () {
        beforeEach(function () {
            this.card.factions.clear();
            this.card.addFaction('stark');
        });

        it('should return true if it has that faction', function () {
            expect(this.card.isFaction('stark')).toBe(true);
        });

        it('should return true regardless of case', function () {
            expect(this.card.isFaction('StArK')).toBe(true);
        });

        it('should return false for unaffiliated factions', function () {
            expect(this.card.isFaction('baratheon')).toBe(false);
        });

        describe('when the card is neutral', function () {
            beforeEach(function () {
                this.card.factions.clear();
                this.card.addFaction('neutral');
            });

            it('should return true for neutral', function () {
                expect(this.card.isFaction('neutral')).toBe(true);
            });

            it('should return false if it gains a faction affiliation (e.g. Ward)', function () {
                this.card.addFaction('stark');
                expect(this.card.isFaction('neutral')).toBe(false);
            });
        });

        describe('when the card loses all factions', function () {
            beforeEach(function () {
                this.card.flags.add(Flags.losesAspect.allFactions);
            });

            it('should return true for neutral', function () {
                expect(this.card.isFaction('neutral')).toBe(true);
            });
        });

        describe('when the card loses a specific faction', function () {
            beforeEach(function () {
                this.card.addFaction('lannister');
                this.card.flags.add(Flags.losesAspect.faction('stark'));
            });

            it('should return false for the faction lost', function () {
                expect(this.card.isFaction('stark')).toBe(false);
            });

            it('should not lose any other faction', function () {
                expect(this.card.isFaction('lannister')).toBe(true);
            });

            it('should read as neutral if it has lost all its specific factions', function () {
                this.card.flags.add(Flags.losesAspect.faction('lannister'));

                expect(this.card.isFaction('neutral')).toBe(true);
            });
        });
    });

    describe('tokens', function () {
        it('should not have tokens by default', function () {
            expect(this.card.hasToken('foo')).toBe(false);
        });

        describe('adding a token', function () {
            it('should increase the tokens by the given amount', function () {
                this.card.modifyToken('foo', 1);

                expect(this.card.tokens.foo).toBe(1);
                expect(this.card.hasToken('foo')).toBe(true);
            });
        });

        describe('removing an existing tokens', function () {
            beforeEach(function () {
                this.card.modifyToken('foo', 2);
            });

            it('should reduce the tokens by the given amount', function () {
                this.card.modifyToken('foo', -1);

                expect(this.card.tokens.foo).toBe(1);
                expect(this.card.hasToken('foo')).toBe(true);

                this.card.modifyToken('foo', -1);
                expect(this.card.hasToken('foo')).toBe(false);
            });
        });

        describe('remove a missing token', function () {
            it('should not set the token value', function () {
                this.card.modifyToken('foo', -1);

                expect(this.card.tokens.foo).toBeUndefined();
                expect(this.card.hasToken('foo')).toBe(false);
            });
        });
    });
});
