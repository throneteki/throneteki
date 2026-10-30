describe("Conspirator's Blade", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Tumblestone Knight'],
                hand: ['One, Two, Three'],
                shadows: ["Conspirator's Blade", 'Undercity Spymaster'],
                gold: 2
            }
        });
        this.player1.clickCard(this.conspiratorsBlade);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.conspiratorsBlade);
    });

    it('reduces the cost of the next card you bring out of shadows by 2, and stops your events being canceled while the attached character participates', function () {
        this.player1.clickCard(this.undercitySpymaster);

        expect(this.undercitySpymaster.location).toBe('play area');
        expect(this.player1Object.gold).toBe(0);

        this.completeMarshalPhase();
        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        expect(this.player1).isReadyToTakeAction();
    });
});
