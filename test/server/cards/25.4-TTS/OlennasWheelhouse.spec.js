describe("Olenna's Wheelhouse", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [{ card: "Olenna's Wheelhouse", gold: 1 }, 'Margaery Tyrell (Core)']
            },
            player2: { power: 3 }
        });
        this.player1.clickCard(this.olennasWheelhouse);
        this.player1.clickCard(this.margaeryTyrell);
    });

    it('kneels and discards 1 gold to remove a tyrell character you control from the game until the next phase begins', function () {
        expect(this.olennasWheelhouse.gold).toBe(0);
        expect(this.margaeryTyrell.location).toBe('out of game');

        this.completeMarshalPhase();

        expect(this.margaeryTyrell.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
