describe('Dickon Tarly (TTS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Growing Strong'],
                inPlay: [
                    { card: 'Dickon Tarly (TTS)', kneeling: true },
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
        this.player1.triggerAbility(this.dickonTarly);
    });

    it('stands after a tyrell character you control stands', function () {
        expect(this.dickonTarly.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
