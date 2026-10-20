describe('Gifts for the Widow (DitD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                gold: 2,
                hand: ['Gifts for the Widow (DitD)'],
                inPlay: ['House Maester'],
                drawDeck: ['Noble Lineage', "Syrio's Training", 'Valyrian Steel Dagger (LoCR)']
            },
            player2: {
                inPlay: ['Bastard in Hiding']
            }
        });

        this.player1.clickCard(this.giftsForTheWidow);
        this.player1.selectValue('1');
    });

    it('searches for an attachment with printed cost X or lower', function () {
        expect(this.player1Object.gold).toBe(1);
        expect(this.player1).toBeAbleToSelect(this.nobleLineage);
        expect(this.player1).toBeAbleToSelect(this.syriosTraining);
        expect(this.player1).not.toBeAbleToSelect(this.valyrianSteelDagger);
    });

    it('puts it into play attached to a character you control', function () {
        this.player1.clickCard(this.syriosTraining);

        expect(this.player1).toBeAbleToSelect(this.houseMaester);
        expect(this.player1).not.toBeAbleToSelect(this.bastardInHiding);

        this.player1.clickCard(this.houseMaester);

        expect(this.houseMaester.attachments).toContain(this.syriosTraining);
        expect(this.giftsForTheWidow.location).toBe('discard pile');
        expect(this.game.getPlainTextLog()).toContain(
            'player1 plays Gifts for the Widow to search their deck for an attachment with printed cost 1 or lower'
        );
        expect(this.game.getPlainTextLog()).toContain('player1 shuffles their deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
