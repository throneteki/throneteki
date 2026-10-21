describe('Fields of the Reach', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'Fields of the Reach',
                    'Rose Garden',
                    'Highgarden Treasury',
                    'Margaery Tyrell (Core)'
                ]
            },
            player2: { power: 3 }
        });
        this.unopposedChallenge(this.player1, 'Power', this.margaeryTyrell);
        this.player1.triggerAbility(this.fieldsOfTheReach);
    });

    it('kneels 3 The Reach locations to raise your claim by 1 after you win a power challenge', function () {
        this.player1.clickCard(this.fieldsOfTheReach);
        this.player1.clickCard(this.roseGarden);
        this.player1.clickCard(this.highgardenTreasury);
        this.player1.clickPrompt('Done');

        expect(this.highgardenTreasury.kneeled).toBe(true);
        expect(this.player2Object.faction.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
