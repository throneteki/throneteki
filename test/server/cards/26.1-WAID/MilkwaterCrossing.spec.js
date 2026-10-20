describe('Milkwater Crossing', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                gold: 1,
                hand: ['Nightmares'],
                inPlay: ['Milkwater Crossing (WAID)', 'Maester Wendamyr']
            },
            player2: {
                inPlay: ['Stannis Baratheon (FotS)']
            }
        });

        this.player1.clickPrompt('Pass');
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickPrompt('Pass');
    });

    it('gives you +1 initiative', function () {
        expect(this.player1Object.getInitiative()).toBe(1);
        expect(this.player2Object.getInitiative()).toBe(0);
        expect(this.maesterWendamyr.hasKeyword('stealth')).toBe(true);
    });

    describe('after a phase begins', function () {
        beforeEach(function () {
            this.player1.triggerAbility(this.milkwaterCrossing);
        });

        it('kneels, is sacrificed, and each character loses keywords and immunities', function () {
            expect(this.milkwaterCrossing.location).toBe('discard pile');
            expect(this.maesterWendamyr.hasKeyword('stealth')).toBe(false);
            expect(this.player1Object.getInitiative()).toBe(0);

            this.player1.clickCard(this.nightmares);

            expect(this.player1).toBeAbleToSelect(this.stannisBaratheon);
            expect(this.player1).toBeAbleToSelect(this.maesterWendamyr);
            this.player1.clickCard(this.stannisBaratheon);

            expect(this.nightmares.location).toBe('discard pile');
            expect(this.stannisBaratheon.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
