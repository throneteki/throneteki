describe('Azor Ahai Reborn', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Maester Wendamyr', attachments: ['Azor Ahai Reborn'] },
                    'Fiery Followers',
                    "R'hllor Infiltrator",
                    'House Maester'
                ]
            },
            player2: {
                gold: 1,
                inPlay: ['Highgarden (Core)', 'Bastard in Hiding']
            }
        });
    });

    describe("when another R'hllor character you control is attacking", function () {
        beforeEach(function () {
            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.fieryFollowers);
            this.player1.clickCard(this.houseMaester);
            this.player1.clickPrompt('Done');
        });

        it('participates, and does not prompt for stealth', function () {
            expect(this.maesterWendamyr.isParticipating()).toBe(true);
            expect(this.fieryFollowers.isParticipating()).toBe(true);
            expect(this.houseMaester.isParticipating()).toBe(true);
            expect(this.rhllorInfiltrator.isParticipating()).toBe(false);
            expect(this.player1).not.toHavePrompt('Select stealth target for Maester Wendamyr');
            expect(this.player1).toHavePrompt('Initiate an action');
        });

        it("stops participating once no attacking R'hllor character you control remains", function () {
            this.player1.clickPrompt('Pass');
            this.player2.clickMenu(this.highgarden, 'Remove character from challenge');
            this.player2.clickCard(this.fieryFollowers);

            expect(this.fieryFollowers.isParticipating()).toBe(false);
            expect(this.maesterWendamyr.isParticipating()).toBe(false);
            expect(this.houseMaester.isParticipating()).toBe(true);
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });

    describe("when no other R'hllor character you control is attacking", function () {
        beforeEach(function () {
            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.houseMaester);
            this.player1.clickPrompt('Done');
        });

        it('does not participate', function () {
            expect(this.maesterWendamyr.isParticipating()).toBe(false);
            expect(this.houseMaester.isParticipating()).toBe(true);
            expect(this.fieryFollowers.isParticipating()).toBe(false);
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });

    describe('when the attached character is declared as an attacker', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.maesterWendamyr);
            this.player1.clickPrompt('Done');
        });

        it("still prompts for that character's own stealth", function () {
            expect(this.player1).toHavePrompt('Select stealth target for Maester Wendamyr');

            this.player1.clickCard(this.bastardInHiding);

            expect(this.maesterWendamyr.isParticipating()).toBe(true);
            expect(this.bastardInHiding.kneeled).toBe(false);
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });
});
