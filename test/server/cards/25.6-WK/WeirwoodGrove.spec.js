describe('Weirwood Grove', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { inPlay: ['Weirwood Grove'] },
            player2: { plotDeck: ['Counting Coppers'] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Counting Coppers');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility(this.weirwoodGrove);
    });

    it("kneels your faction card and removes itself from the game to initiate the when revealed ability of an opponent's plot", function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.weirwoodGrove.location).toBe('out of game');
        expect(this.player1Object.hand).toHaveLength(5);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Weirwood Grove against an Omen plot', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { inPlay: ['Weirwood Grove'] },
            player2: { plotDeck: ['Ghosts of Harrenhal'] }
        });

        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Ghosts of Harrenhal');
        this.selectFirstPlayer(this.player1);
    });

    it('cannot be triggered', function () {
        expect(this.weirwoodGrove.location).toBe('play area');
        expect(this.player1Object.faction.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
