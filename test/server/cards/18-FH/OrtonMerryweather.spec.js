describe('Orton Merryweather', function () {
    it('returns an event from your discard pile to your hand after a Small Council card is marshaled', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Orton Merryweather (FH)'], discard: ['Growing Strong'] }
        });
        this.player1.clickCard(this.ortonMerryweather);
        this.player1.triggerAbility('Orton Merryweather');
        expect(this.player1).toHavePrompt('Select an event');
        this.player1.clickCard(this.growingStrong);
        expect(this.growingStrong.location).toBe('hand');
    });

    it('puts a non-unique Spy into play from your hand when it leaves play', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Orton Merryweather (FH)'],
                hand: ['Courtesan of the Rose', 'Hedge Knight']
            },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
        this.player1.clickCard(this.ortonMerryweather);
        this.player1.triggerAbility('Orton Merryweather');
        expect(this.player1).not.toAllowSelect(this.hedgeKnight);
        this.player1.clickCard(this.courtesanOfTheRose);
        expect(this.courtesanOfTheRose.location).toBe('play area');
        expect(this.hedgeKnight.location).toBe('hand');
    });
});
