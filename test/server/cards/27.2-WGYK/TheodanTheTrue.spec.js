describe('Theodan the True', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Theodan the True', 'Devout Freerider', 'Tumblestone Knight']
            },
            player2: {
                inPlay: ['Silent Sisters']
            }
        });
    });

    describe('when you win a challenge in which it is participating', function () {
        beforeEach(function () {
            this.unopposedChallenge(this.player1, 'Power', this.theodanTheTrue);
        });

        it('can be triggered', function () {
            expect(this.player1).toAllowAbilityTrigger(this.theodanTheTrue);
        });

        describe('and it is triggered', function () {
            beforeEach(function () {
                this.player1.triggerAbility(this.theodanTheTrue);
            });

            it('can only choose a The Seven character', function () {
                expect(this.player1).toBeAbleToSelect(this.theodanTheTrue);
                expect(this.player1).toBeAbleToSelect(this.devoutFreerider);
                expect(this.player1).toBeAbleToSelect(this.silentSisters);
                expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);
            });

            it('gives the character renown until the end of the phase', function () {
                this.player1.clickCard(this.devoutFreerider);
                this.player1.clickPrompt('Renown');

                expect(this.devoutFreerider.hasKeyword('renown')).toBe(true);
                expect(this.devoutFreerider.hasKeyword('insight')).toBe(false);
                expect(this.theodanTheTrue.hasKeyword('renown')).toBe(false);
                expect(this.player1).isReadyToTakeAction();

                this.completeChallengesPhase();

                expect(this.devoutFreerider.hasKeyword('renown')).toBe(false);
            });

            it('can give the character insight instead', function () {
                this.player1.clickCard(this.silentSisters);
                this.player1.clickPrompt('Insight');

                expect(this.silentSisters.hasKeyword('insight')).toBe(true);
                expect(this.silentSisters.hasKeyword('renown')).toBe(false);
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe('when you win a challenge in which it is not participating', function () {
        beforeEach(function () {
            this.unopposedChallenge(this.player1, 'Power', this.devoutFreerider);
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.theodanTheTrue);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when you lose a challenge in which it is participating', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Intrigue');
            this.player2.clickCard(this.silentSisters);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.theodanTheTrue);
        });
    });
});

describe('Theodan the True, limit', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'The New Gods',
                gold: 5,
                inPlay: ['Theodan the True', 'Devout Freerider', 'Magister Illyrio (Core)']
            },
            player2: {
                inPlay: ['Palace Spearman', 'Bastard in Hiding']
            }
        });

        this.unopposedChallenge(this.player1, 'Power', this.theodanTheTrue);
        this.player1.triggerAbility(this.theodanTheTrue);
        this.player1.clickCard(this.devoutFreerider);
        this.player1.clickPrompt('Renown');

        this.unopposedChallenge(this.player1, 'Military', this.theodanTheTrue);
        this.player1.triggerAbility(this.theodanTheTrue);
        this.player1.clickCard(this.devoutFreerider);
        this.player1.clickPrompt('Insight');
        this.player2.clickCard(this.bastardInHiding);

        this.player1.clickMenu(this.magisterIllyrio, 'Stand a character');
        this.player1.clickCard(this.theodanTheTrue);
        this.player1.clickPrompt('Done');

        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.palaceSpearman);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.theodanTheTrue);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('cannot be triggered a third time in the phase', function () {
        expect(this.devoutFreerider.hasKeyword('renown')).toBe(true);
        expect(this.devoutFreerider.hasKeyword('insight')).toBe(true);
        expect(this.game.getPlainTextLog()).toContain('player1 won a military challenge 5 vs 4');
        expect(this.player1).not.toAllowAbilityTrigger(this.theodanTheTrue);
        expect(this.player2).isReadyToTakeAction();
    });
});
