describe('Lady Marya', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'baratheon',
                inPlay: ['Lady Marya', 'Ser Davos Seaworth (Core)']
            },
            player2: { drawDeck: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.serDavosSeaworth);
        this.player1.triggerAbility('Lady Marya');
    });

    it("kneels to attach the top card of the losing opponent's deck facedown under your control, as a Terminal location-only attachment", function () {
        expect(this.ladyMarya.kneeled).toBe(true);
        expect(this.hedgeKnight.parent).toBe(this.ladyMarya);
        expect(this.hedgeKnight.facedown).toBe(true);
        expect(this.hedgeKnight).toBeControlledBy(this.player1);
        expect(this.hedgeKnight.getType()).toBe('attachment');
        expect(this.hedgeKnight.isTerminal()).toBe(true);
    });

    it('lets you marshal the facedown card as if it were in your hand', function () {
        this.completeChallengesPhase();
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.hedgeKnight.getType()).toBe('character');
        expect(this.hedgeKnight).toBeControlledBy(this.player1);
    });
});
