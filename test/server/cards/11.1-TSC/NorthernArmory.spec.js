describe('Northern Armory', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'stark',
                inPlay: [
                    'Northern Armory',
                    { card: 'Tumblestone Knight', kneeling: true },
                    { card: 'House Maester', kneeling: true }
                ]
            }
        });
    });

    it('gives +1 income', function () {
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });

    describe('when used', function () {
        beforeEach(function () {
            this.player1.clickMenu(this.northernArmory, 'Stand a character');
        });

        it('kneels to stand a [stark] character', function () {
            expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.houseMaester);

            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.northernArmory.kneeled).toBe(true);
            expect(this.tumblestoneKnight.kneeled).toBe(false);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 kneels Northern Armory to stand Tumblestone Knight'
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not stand in the standing phase', function () {
            this.player1.clickCard(this.tumblestoneKnight);
            this.completeMarshalPhase();
            this.completeChallengesPhase();

            expect(this.houseMaester.kneeled).toBe(false);
            expect(this.northernArmory.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
