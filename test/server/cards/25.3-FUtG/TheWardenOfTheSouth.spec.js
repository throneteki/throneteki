describe('The Warden of the South', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Growing Strong'],
                inPlay: [
                    {
                        card: 'Mace Tyrell (HoT)',
                        kneeling: true,
                        attachments: ['The Warden of the South']
                    }
                ]
            }
        });
        this.player1.clickCard(this.growingStrong);
        this.player1.clickCard(this.maceTyrell);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.theWardenOfTheSouth);
    });

    it('gives the attached character +1 STR and Commander, and kneels to stand it after its STR is increased by a card effect', function () {
        expect(this.maceTyrell.hasTrait('Commander')).toBe(true);
        expect(this.maceTyrell.getStrength()).toBe(8);
        expect(this.maceTyrell.kneeled).toBe(false);
        expect(this.theWardenOfTheSouth.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
