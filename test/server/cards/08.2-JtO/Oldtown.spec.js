describe('Oldtown (JtO)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Oldtown (JtO)'],
                drawDeck: ['Tumblestone Knight']
            }
        });

        this.player1.clickCard(this.oldtown);
    });

    it('draws the revealed card and gains 1 power if it has the named cardtype', function () {
        this.player1.clickPrompt('Character');

        expect(this.oldtown.kneeled).toBe(true);
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player1Object.faction.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does nothing more if the revealed card has a different cardtype', function () {
        this.player1.clickPrompt('Location');

        expect(this.tumblestoneKnight.location).toBe('draw deck');
        expect(this.player1Object.faction.power).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
