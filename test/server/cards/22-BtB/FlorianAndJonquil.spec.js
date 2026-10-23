describe('"Florian and Jonquil" (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Arya Stark (Core)', 'Winterfell Steward', 'Robb Stark (Core)'],
                hand: ['"Florian and Jonquil" (BtB)'],
                gold: 1
            }
        });
        this.player1.clickCard(this.florianAndJonquil);
    });

    it('chooses a unique character with printed cost 3 or lower', function () {
        expect(this.player1).toBeAbleToSelect(this.aryaStark);
        expect(this.player1).not.toBeAbleToSelect(this.winterfellSteward);
        expect(this.player1).not.toBeAbleToSelect(this.robbStark);
    });

    describe('after choosing a character', function () {
        beforeEach(function () {
            this.player1.clickCard(this.aryaStark);
        });

        it('gives it renown until the end of the phase', function () {
            expect(this.aryaStark.hasKeyword('renown')).toBe(true);
        });

        it('then attaches itself to it as a Terminal attachment that gives the Fool and Knight traits', function () {
            expect(this.florianAndJonquil.parent).toBe(this.aryaStark);
            expect(this.florianAndJonquil.getType()).toBe('attachment');
            expect(this.florianAndJonquil.isTerminal()).toBe(true);
            expect(this.aryaStark.hasTrait('Fool')).toBe(true);
            expect(this.aryaStark.hasTrait('Knight')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
