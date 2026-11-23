describe('Ser Dontos Hollard', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Ser Dontos Hollard', kneeling: true }, 'Margaery Tyrell (Core)']
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.burnedMen);
        this.player1.clickCard(this.margaeryTyrell);
        this.player1.triggerAbility(this.serDontosHollard);
    });

    it('stands to save a Lady character that would be killed or discarded', function () {
        expect(this.serDontosHollard.kneeled).toBe(false);
        expect(this.margaeryTyrell.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
