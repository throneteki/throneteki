describe('Aloof and Apart', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                agenda: 'Aloof and Apart',
                hand: ['Ser Jaime Lannister (Core)'],
                inPlay: ['Khal Drogo (Core)', 'Tumblestone Knight']
            }
        });
    });

    it('gives each character you control with printed cost 6 or higher prized 1', function () {
        expect(this.khalDrogo.getPrizedValue()).toBe(1);
        expect(this.tumblestoneKnight.getPrizedValue()).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('reduces the cost of the first character with printed cost 6 or higher you marshal each round by 2', function () {
        this.player1.clickCard(this.serJaimeLannister);

        expect(this.serJaimeLannister.location).toBe('play area');
        expect(this.player1Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
