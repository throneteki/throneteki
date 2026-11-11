describe('Highgarden (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                inPlay: ['Highgarden (BtB)', 'Margaery Tyrell (Core)', 'Hedge Knight'],
                hand: ['Garden Caretaker', "Olenna's Informant", 'Burned Men']
            }
        });
    });

    describe('when revealing Tyrell characters', function () {
        beforeEach(function () {
            this.player1.clickMenu(this.highgarden, 'Give characters +STR');
        });

        it('only reveals Tyrell characters from your hand', function () {
            expect(this.player1).toBeAbleToSelect(this.gardenCaretaker);
            expect(this.player1).not.toBeAbleToSelect(this.burnedMen);
        });

        it('kneels to give a character +2 STR until the end of the phase for each card revealed', function () {
            this.player1.clickCard(this.gardenCaretaker);
            this.player1.clickCard(this.olennasInformant);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickCard(this.hedgeKnight);
            expect(this.highgarden.kneeled).toBe(true);
            expect(this.hedgeKnight.getStrength()).toBe(6);
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            expect(this.hedgeKnight.getStrength()).toBe(2);
        });
    });

    it('returns a unique Tyrell character you control to your hand once per phase', function () {
        this.player1.clickMenu(this.highgarden, 'Return character to hand');
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
        this.player1.clickCard(this.margaeryTyrell);
        expect(this.margaeryTyrell.location).toBe('hand');
        expect(
            this.player1.actionUnavailableReason(this.highgarden, 'Return character to hand')
        ).toBe('limit');
    });
});
