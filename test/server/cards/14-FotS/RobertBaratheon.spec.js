describe('Robert Baratheon (FotS)', function () {
    function setup(choice) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Robert Baratheon (FotS)'] },
            player2: {
                inPlay: [
                    { card: 'Hedge Knight', kneeling: true },
                    { card: 'Ser Barristan Selmy (FtR)', kneeling: true },
                    { card: 'The Roseroad', kneeling: true }
                ]
            }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility('Robert Baratheon');
        this.player1.clickPrompt(choice);
    }

    it("stops opponents' characters with printed cost 4 or lower standing this phase", function () {
        setup.call(this, 'Printed Cost 4-');
        expect(this.hedgeKnight.kneeled).toBe(true);
        expect(this.serBarristanSelmy.kneeled).toBe(false);
        expect(this.theRoseroad.kneeled).toBe(false);
    });

    it('or other characters with printed cost 5 or higher', function () {
        setup.call(this, 'Printed Cost 5+');
        expect(this.hedgeKnight.kneeled).toBe(false);
        expect(this.serBarristanSelmy.kneeled).toBe(true);
    });

    it('or locations', function () {
        setup.call(this, 'Locations');
        expect(this.theRoseroad.kneeled).toBe(true);
        expect(this.hedgeKnight.kneeled).toBe(false);
    });
});
