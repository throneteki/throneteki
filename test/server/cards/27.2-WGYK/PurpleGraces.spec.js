describe('Purple Graces', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['House Dayne Knight', 'Tumblestone Knight']
            },
            player2: {
                faction: 'targaryen',
                inPlay: ['Purple Graces', 'Bastard in Hiding']
            }
        });
    });

    it('cannot be used outside a challenge', function () {
        expect(this.player2.actionUnavailableReason(this.purpleGraces)).toBe('condition');
    });

    it('cannot be used during an intrigue challenge', function () {
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.houseDayneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Pass');

        expect(this.player2.actionUnavailableReason(this.purpleGraces)).toBe('condition');
    });

    describe('during a military challenge', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.houseDayneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Pass');

            this.player2.clickMenu(this.purpleGraces, 'Give an attacker -2 STR');
        });

        it('can only choose an attacking character', function () {
            expect(this.player2).toBeAbleToSelect(this.houseDayneKnight);
            expect(this.player2).not.toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player2).not.toBeAbleToSelect(this.purpleGraces);
            expect(this.player2).not.toBeAbleToSelect(this.bastardInHiding);
        });

        it('kneels Purple Graces to give the attacker -2 STR', function () {
            this.player2.clickCard(this.houseDayneKnight);

            expect(this.purpleGraces.kneeled).toBe(true);
            expect(this.houseDayneKnight.getStrength()).toBe(0);
            expect(this.tumblestoneKnight.getStrength()).toBe(2);
            expect(this.bastardInHiding.getStrength()).toBe(2);
            expect(this.player1).toHavePrompt('Initiate an action');
            this.player1.clickPrompt('Pass');
            expect(this.player2.actionUnavailableReason(this.purpleGraces)).toBe('cost');
            expect(this.player2).toHavePrompt('Initiate an action');
        });
    });
});
