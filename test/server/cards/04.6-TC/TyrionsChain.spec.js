describe("Tyrion's Chain", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Heads on Spikes',
                hand: ["Tyrion's Chain"],
                inPlay: ['Cersei Lannister (Core)']
            },
            player2: { hand: ['Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.cerseiLannister);
        this.startingPower = this.player1Object.faction.power;
        this.player1.triggerAbility(this.tyrionsChain);
    });

    it('initiates the when revealed ability of a revealed War plot after you win a challenge with a participating unique lannister character', function () {
        this.player1.clickCard(this.headsOnSpikes);

        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1Object.faction.power).toBe(this.startingPower + 3);
        expect(this.player1).isReadyToTakeAction();
    });
});
