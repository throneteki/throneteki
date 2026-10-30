describe('Support of Saltcliffe', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: [{ card: "Black Wind's Crew", attachments: ['Support of Saltcliffe'] }]
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.blackWindsCrew);
        this.player1.triggerAbility(this.supportOfSaltcliffe);
    });

    it('gives the attached character stealth, and stands it after you win an unopposed challenge it is attacking in', function () {
        expect(this.blackWindsCrew.hasKeyword('stealth')).toBe(true);
        expect(this.blackWindsCrew.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
