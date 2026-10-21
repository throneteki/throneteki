describe('The Warden of the North', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Nightmares'],
                inPlay: [{ card: 'Robb Stark (AtSK)', attachments: ['The Warden of the North'] }]
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.robbStark);
        this.player1.clickPrompt('Done');
    });

    it('gives the attached character the Commander trait and renown, and stops events being played while it participates', function () {
        expect(this.robbStark.hasTrait('Commander')).toBe(true);
        expect(this.robbStark.hasKeyword('Renown')).toBe(true);
        expect(this.player1Object.canPlay(this.nightmares)).toBe(false);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
