describe('Roose Bolton', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'stark', inPlay: ['Roose Bolton (GoH)'] },
            player2: { inPlay: ['Hedge Knight', 'Burned Men', 'Winterfell Steward'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.rooseBolton);
        this.player1.triggerAbility('Roose Bolton');
    });

    it("sacrifices Roose Bolton to kill up to his STR worth of the losing opponent's characters", function () {
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.burnedMen);
        expect(this.player1).not.toBeAbleToSelect(this.winterfellSteward);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        expect(this.rooseBolton.location).not.toBe('play area');
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.burnedMen.location).toBe('dead pile');
        expect(this.winterfellSteward.location).toBe('play area');
    });

    it('uses his STR as he was sacrificed', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'stark',
                inPlay: [{ card: 'Roose Bolton (GoH)', attachments: ['Ice (Core)'] }]
            },
            player2: { inPlay: ['Hedge Knight', 'Burned Men', 'Tumblestone Knight'] }
        });
        const roose = this.player1.findCardByName('Roose Bolton', 'play area');
        this.unopposedChallenge(this.player1, 'Military', roose);
        this.player1.triggerAbility('Roose Bolton');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.burnedMen);
        expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
    });
});
