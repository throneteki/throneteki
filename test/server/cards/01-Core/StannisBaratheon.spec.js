describe('Stannis Baratheon (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'Stannis Baratheon (Core)',
                    { card: 'Tumblestone Knight', kneeling: true },
                    { card: 'Bastard in Hiding', kneeling: true },
                    { card: 'House Dayne Knight', kneeling: true },
                    { card: 'The Roseroad', kneeling: true }
                ]
            },
            player2: {
                inPlay: [
                    { card: 'Hedge Knight', kneeling: true },
                    { card: 'House Maester', kneeling: true }
                ]
            }
        });

        this.completeChallengesPhase();
    });

    it('makes a player with more than 2 kneeling characters choose 2 to stand', function () {
        expect(this.player1).toHavePrompt('Select 2 cards to stand');
        expect(this.player1).not.toBeAbleToSelect(this.theRoseroad);
        expect(this.player1).not.toBeAbleToSelect(this.stannisBaratheon);

        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.houseDayneKnight);
        this.player1.clickPrompt('Done');

        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.houseDayneKnight.kneeled).toBe(false);
        expect(this.bastardInHiding.kneeled).toBe(true);
        expect(this.theRoseroad.kneeled).toBe(false);
        expect(this.player1).toHavePrompt('Select a plot');
    });

    it('stands every character of a player with 2 or fewer kneeling', function () {
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.houseDayneKnight);
        this.player1.clickPrompt('Done');

        expect(this.hedgeKnight.kneeled).toBe(false);
        expect(this.houseMaester.kneeled).toBe(false);
        expect(this.player2).toHavePrompt('Select a plot');
    });
});
