describe('Patchface', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'baratheon',
                inPlay: ['Patchface', 'Ser Dontos Hollard', 'Samwell Tarly (Core)']
            },
            player2: {
                inPlay: ['Moon Boy']
            }
        });
    });

    it('gains the keywords of other Fool characters', function () {
        expect(this.moonBoy.hasKeyword('insight')).toBe(true);
        expect(this.patchface.hasKeyword('insight')).toBe(true);
        expect(this.serDontosHollard.hasKeyword('insight')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gains the challenge icons of other Fool characters', function () {
        expect(this.patchface.hasIcon('military')).toBe(true);
        expect(this.patchface.hasIcon('power')).toBe(true);
        expect(this.patchface.hasIcon('intrigue')).toBe(false);
        expect(this.samwellTarly.hasIcon('military')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
