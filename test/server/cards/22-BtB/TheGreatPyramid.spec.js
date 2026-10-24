describe('The Great Pyramid', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                inPlay: ['The Great Pyramid'],
                hand: ['Nightmares'],
                gold: 1
            },
            player2: {
                inPlay: ['House Dayne Knight', 'Ser Jaime Lannister (Core)'],
                hand: ['Put to the Torch'],
                gold: 1
            }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Intrigue', this.houseDayneKnight);
        this.player1.triggerAbility('The Great Pyramid');
    });

    it('places cards discarded from your hand facedown under it', function () {
        expect(this.theGreatPyramid.underneath).toContain(this.nightmares);
        expect(this.nightmares.facedown).toBe(true);
    });

    it('lets you play a facedown card under it as if it were in your hand', function () {
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.serJaimeLannister);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.nightmares);
        this.player1.clickCard(this.serJaimeLannister);
        expect(this.nightmares.location).toBe('discard pile');
        expect(this.serJaimeLannister.isAnyBlank()).toBe(true);
    });

    it('removes each card you placed under it from the game when it leaves play', function () {
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player2.triggerAbility(this.putToTheTorch);
        this.player2.clickCard(this.theGreatPyramid);
        expect(this.theGreatPyramid.location).toBe('discard pile');
        expect(this.nightmares.location).toBe('out of game');
    });
});
