describe('Lady Whiskers (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Tommen Baratheon (LoCR)', attachments: ['Lady Whiskers (BtB)'] }]
            }
        });
    });

    it('gives Tommen Baratheon stealth', function () {
        expect(this.tommenBaratheon.hasKeyword('Stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('stops the attached character kneeling when declared as an attacker in a [power] challenge', function () {
        this.unopposedChallenge(this.player1, 'Power', this.tommenBaratheon);

        expect(this.tommenBaratheon.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
