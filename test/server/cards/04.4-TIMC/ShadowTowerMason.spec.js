describe('Shadow Tower Mason', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [
                    { card: 'Shadow Tower Mason', attachments: ['Longclaw', 'Practice Blade'] },
                    'The Wall (Core)'
                ]
            }
        });
    });

    it('gains a [military] and an [intrigue] icon while you control 3 or more [thenightswatch] locations and attachments', function () {
        expect(this.shadowTowerMason.hasIcon('military')).toBe(true);
        expect(this.shadowTowerMason.hasIcon('intrigue')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
