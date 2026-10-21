describe("Tyrion's Chain", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Heads on Spikes'],
                hand: ["Tyrion's Chain"],
                inPlay: ['Cersei Lannister (Core)']
            },
            player2: { hand: ['Tumblestone Knight'] }
        });

        this.player1.selectPlot('Heads on Spikes');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();
        this.unopposedChallenge(this.player1, 'Power', this.cerseiLannister);
        this.player1.triggerAbility(this.tyrionsChain);
    });

    it('initiates the when revealed ability of a revealed War plot after you win a challenge with a participating unique lannister character', function () {
        this.player1.clickCard(this.headsOnSpikes);

        expect(this.player2Object.deadPile).toHaveLength(2);
        expect(this.player1Object.faction.power).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
