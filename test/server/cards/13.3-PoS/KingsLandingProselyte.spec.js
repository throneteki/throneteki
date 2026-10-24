describe("King's Landing Proselyte", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: ['Old Captain (ChoS)', "Black Wind's Crew"],
                shadows: ["King's Landing Proselyte"],
                gold: 0
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.oldCaptain);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.kingsLandingProselyte);
        this.player1.clickCard(this.blackWindsCrew);
    });

    it('kills a standing greyjoy character to put itself into play from shadows', function () {
        expect(this.blackWindsCrew.location).toBe('dead pile');
        expect(this.kingsLandingProselyte.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
