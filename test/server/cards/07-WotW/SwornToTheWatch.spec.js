describe('Sworn to the Watch', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [
                    { card: 'Tumblestone Knight', attachments: ['Sworn to the Watch'] },
                    { card: 'House Maester', attachments: ['Sworn to the Watch'] }
                ]
            }
        });
    });

    it('gives the attached character the [thenightswatch] affiliation and a trait for each of its icons', function () {
        expect(this.tumblestoneKnight.isFaction('thenightswatch')).toBe(true);
        expect(this.tumblestoneKnight.hasTrait('Ranger')).toBe(true);
        expect(this.tumblestoneKnight.hasTrait('Builder')).toBe(true);
        expect(this.tumblestoneKnight.hasTrait('Steward')).toBe(false);
        expect(this.houseMaester.hasTrait('Steward')).toBe(true);
        expect(this.houseMaester.hasTrait('Ranger')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
