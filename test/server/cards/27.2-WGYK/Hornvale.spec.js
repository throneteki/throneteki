describe('Hornvale', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Hornvale (WGYK)', 'Cersei Lannister (Core)']
            },
            player2: {
                inPlay: ['House Dayne Knight', 'Ser Jaime Lannister (Core)'],
                hand: ['Hedge Knight', 'Put to the Torch'],
                gold: 1
            }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Intrigue');
        this.player2.clickCard(this.houseDayneKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('can trigger after you win an intrigue challenge', function () {
        expect(this.player1).toAllowAbilityTrigger(this.hornvale);
    });

    describe('when triggered', function () {
        beforeEach(function () {
            this.player1.triggerAbility(this.hornvale);
            this.player2.clickCard(this.hedgeKnight);
        });

        it('kneels Hornvale to have the losing opponent place a card from their hand facedown under it', function () {
            expect(this.hornvale.kneeled).toBe(true);
            expect(this.hornvale.underneath).toContain(this.hedgeKnight);
            expect(this.hedgeKnight.facedown).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });

        it("returns each card under it to its owner's hand when Hornvale leaves play", function () {
            this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
            this.player2.triggerAbility(this.putToTheTorch);
            this.player2.clickCard(this.hornvale);
            expect(this.hornvale.location).toBe('discard pile');
            expect(this.hedgeKnight.location).toBe('hand');
            expect(this.player2Object.hand).toContain(this.hedgeKnight);
        });
    });
});
