describe('Outfitted for War', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Iron Fleet Scout', attachments: ['Outfitted for War'] },
                    "Black Wind's Crew"
                ]
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.blackWindsCrew);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.outfittedForWar);
        this.player1.clickCard(this.blackWindsCrew);
    });

    it('kneels the attached location to give a participating greyjoy character +3 STR during a military challenge', function () {
        expect(this.ironFleetScout.kneeled).toBe(true);
        expect(this.blackWindsCrew.getStrength()).toBe(6);
        expect(this.player2).isReadyToTakeAction();
    });
});
