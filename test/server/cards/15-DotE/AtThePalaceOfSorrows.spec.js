describe('At the Palace of Sorrows (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Ser Jaime Lannister (Core)', 'Steward at the Wall']
            },
            player2: { plot: 'At the Palace of Sorrows (DotE)' }
        });
    });

    it("sets each character's STR to 3", function () {
        expect(this.serJaimeLannister.getStrength()).toBe(3);
        expect(this.stewardAtTheWall.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('At the Palace of Sorrows with STR penalties', function () {
    it('overrides them, so a character with Crown of Gold under Blood of the Dragon survives', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'At the Palace of Sorrows (DotE)',
                inPlay: [{ card: 'Hedge Knight', attachments: ['Crown of Gold (TRtW)'] }]
            },
            player2: { plot: 'Blood of the Dragon' }
        });

        expect(this.hedgeKnight.getStrength()).toBe(3);
        expect(this.hedgeKnight.location).toBe('play area');
    });
});
