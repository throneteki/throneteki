describe('Jory Cassel', function () {
    function setup(plot) {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { plot, inPlay: ['Jory Cassel', 'Arya Stark (Core)'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.aryaStark);
        this.player1.triggerAbility('Jory Cassel');
    }

    it('sacrifices itself to save a unique stark character', function () {
        setup.call(this, 'Filler Plot');
        expect(this.joryCassel.location).toBe('discard pile');
        expect(this.aryaStark.location).toBe('play area');
        expect(this.aryaStark.power).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });

    it('then has the saved character gain 1 power with a Winter plot revealed', function () {
        setup.call(this, 'Famine');
        expect(this.aryaStark.location).toBe('play area');
        expect(this.aryaStark.power).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
