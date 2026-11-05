describe('"A Lion Still Has Claws"', function () {
    function setup(plot) {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ser Davos Seaworth (TTWDFL)'],
                hand: ['"A Lion Still Has Claws"'],
                gold: 5
            },
            player2: { plot, inPlay: ['Hedge Knight', 'Ser Jon Fossoway'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.serDavosSeaworth);
        this.player1.triggerAbility('"A Lion Still Has Claws"');
        this.player1.selectValue(2);
        this.player1.nameTrait('Knight');
    }

    it('returns each character with the named Trait and printed cost X or lower to hand after you win an intrigue challenge by 5', function () {
        setup.call(this, 'Filler Plot');
        // Claim for the challenge is applied after the reaction, and discards it from hand.
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.serJonFossoway.location).toBe('play area');
        expect(this.player1Object.gold).toBe(3);
    });

    it('costs 1 less for each Scheme plot revealed', function () {
        setup.call(this, 'The Crone (HMW)');
        expect(this.player1Object.gold).toBe(4);
    });
});
