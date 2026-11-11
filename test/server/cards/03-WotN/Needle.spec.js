describe('Needle', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [{ card: 'Arya Stark (Core)', attachments: ['Needle'] }],
                shadows: ['Smallfolk Mob']
            }
        });
        this.player1.clickCard(this.smallfolkMob);
        this.player1.clickPrompt('Put into play');
        this.player1.clickCard(this.aryaStark);
        this.player1.triggerAbility('Needle');
    });

    it('gives the attached character +2 STR and sacrifices itself to return it to hand when it is sacrificed', function () {
        expect(this.needle.location).toBe('discard pile');
        expect(this.aryaStark.location).toBe('hand');
        expect(this.smallfolkMob.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
