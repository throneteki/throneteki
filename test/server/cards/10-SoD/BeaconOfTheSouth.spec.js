describe('Beacon of the South', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                inPlay: [
                    {
                        card: 'Ser Garlan Tyrell (OR)',
                        gold: 2,
                        attachments: ['Beacon of the South']
                    }
                ]
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serGarlanTyrell);
        this.player1.triggerAbility(this.beaconOfTheSouth);
    });

    it('gives the attached character 1 power after you win a challenge by 5 or more STR in which it is attacking', function () {
        expect(this.serGarlanTyrell.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
