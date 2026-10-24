describe("Mountain's Man", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: [{ card: 'Raff the Sweetling', attachments: ["Mountain's Man"] }]
            },
            player2: { inPlay: ['Iron Fleet Scout'], drawDeck: ["The Hand's Solar"] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.raffTheSweetling);
        this.player1.triggerAbility(this.mountainsMan);
        this.player1.clickCard(this.ironFleetScout);
    });

    it('gives the attached character the House Clegane trait, and kneels a card with lower printed cost after it discards a card using pillage', function () {
        expect(this.raffTheSweetling.hasTrait('House Clegane')).toBe(true);
        expect(this.ironFleetScout.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
