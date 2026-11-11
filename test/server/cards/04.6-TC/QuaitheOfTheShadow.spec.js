describe('Quaithe of the Shadow', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { hand: ['Quaithe of the Shadow'], gold: 3 },
            player2: { inPlay: ['Hedge Knight', 'Robb Stark (Core)'] }
        });
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.robbStark);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('Pass');
        this.player1.clickCard(this.quaitheOfTheShadow);
        this.player1.triggerAbility('Quaithe of the Shadow');
    });

    it('removes each character with STR 2 or lower from the challenge after entering play during it', function () {
        expect(this.hedgeKnight.isParticipating()).toBe(false);
        expect(this.robbStark.isParticipating()).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
