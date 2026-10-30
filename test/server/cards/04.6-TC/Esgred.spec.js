describe('Esgred', function () {
    describe('when Asha Greyjoy enters play while Esgred is in play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'greyjoy',
                    gold: 7,
                    hand: ['Asha Greyjoy (Core)'],
                    inPlay: ['Esgred']
                }
            });

            this.player1.clickCard(this.ashaGreyjoy);
        });

        it('sacrifices Esgred, then Asha gains 1 power', function () {
            expect(this.esgred.location).toBe('discard pile');
            expect(this.ashaGreyjoy.power).toBe(1);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 sacrifices Esgred as they control Asha Greyjoy'
            );
            expect(this.game.getPlainTextLog()).toContain('Then, Asha Greyjoy gains 1 power');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when Esgred enters play while you control Asha Greyjoy', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'greyjoy',
                    gold: 5,
                    hand: ['Esgred'],
                    inPlay: ['Asha Greyjoy (Core)']
                }
            });

            this.player1.clickCard(this.esgred);
        });

        it('sacrifices Esgred, then Asha gains 1 power', function () {
            expect(this.esgred.location).toBe('discard pile');
            expect(this.ashaGreyjoy.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when an opponent controls Asha Greyjoy', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'greyjoy',
                    gold: 5,
                    hand: ['Esgred']
                },
                player2: {
                    inPlay: ['Asha Greyjoy (Core)']
                }
            });

            this.player1.clickCard(this.esgred);
        });

        it('stays in play', function () {
            expect(this.esgred.location).toBe('play area');
            expect(this.ashaGreyjoy.power).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when attacking', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'greyjoy',
                    inPlay: ['Esgred']
                },
                player2: {
                    inPlay: ['Tumblestone Knight', 'House Maester']
                }
            });

            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.esgred);
            this.player1.clickPrompt('Done');
        });

        it('may bypass an additional character using stealth', function () {
            expect(this.player1).toHavePrompt('Select up to 2 stealth targets for Esgred');

            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickCard(this.houseMaester);
            this.player1.clickPrompt('Done');

            expect(this.tumblestoneKnight.bypassedByStealth).toBe(true);
            expect(this.houseMaester.bypassedByStealth).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
