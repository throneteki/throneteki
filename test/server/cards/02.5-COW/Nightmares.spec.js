describe('Nightmares', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { gold: 1, hand: ['Nightmares'] },
            player2: {
                inPlay: [
                    { card: 'Hedge Knight', attachments: ['Little Bird (Core)'] },
                    'Tumblestone Knight',
                    'The Roseroad'
                ]
            }
        });

        this.player1.clickCard(this.nightmares);
    });

    it('can choose a character or location', function () {
        expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
        expect(this.player1).toBeAbleToSelect(this.theRoseroad);
        expect(this.player1).not.toBeAbleToSelect(this.littleBird);

        this.player1.clickCard(this.hedgeKnight);

        expect(this.player1).isReadyToTakeAction();
    });

    describe('when a character is chosen', function () {
        beforeEach(function () {
            this.player1.clickCard(this.hedgeKnight);
        });

        it('treats its text box as blank, except for Traits, until the end of the phase', function () {
            expect(this.nightmares.location).toBe('discard pile');
            expect(this.player1Object.gold).toBe(0);
            expect(this.hedgeKnight.getStrength()).toBe(2);
            expect(this.hedgeKnight.hasTrait('Knight')).toBe(true);
            expect(this.tumblestoneKnight.getStrength()).toBe(2);
            expect(this.player1).isReadyToTakeAction();

            this.completeChallengesPhase();

            expect(this.hedgeKnight.getStrength()).toBe(3);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
