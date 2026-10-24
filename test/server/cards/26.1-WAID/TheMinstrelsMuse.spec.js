describe("The Minstrel's Muse", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: "The Minstrel's Muse",
                gold: 5,
                hand: [
                    '"Florian and Jonquil" (BtB)',
                    '"Lord Renly\'s Ride"',
                    '"Six Maids in a Pool"',
                    'Growing Strong'
                ],
                inPlay: ['Sansa Stark (Core)']
            }
        });
    });

    it('draws 1 card after a Song event is played, and stops you playing more than 3 events this round', function () {
        this.player1.clickCard(this.florianAndJonquil);
        this.player1.clickCard(this.sansaStark);
        this.player1.triggerAbility(this.theMinstrelsMuse);
        this.player1.clickCard(this.lordRenlysRide);
        this.player1.clickCard(this.sansaStark);
        this.player1.triggerAbility(this.theMinstrelsMuse);
        this.player1.clickCard(this.sixMaidsInAPool);
        this.player1.triggerAbility(this.theMinstrelsMuse);

        expect(this.player1Object.hand).toHaveLength(5);
        expect(this.player1).not.toBeAbleToSelect(this.growingStrong);
        expect(this.player1).isReadyToTakeAction();
    });
});
