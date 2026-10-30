describe('"Widow\'s Ford"', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [{ card: 'Tumblestone Knight', attachments: ['Hidden in Shadow'] }],
                shadows: ['"Widow\'s Ford"']
            }
        });
        this.player1.clickCard(this.hiddenInShadow);
        this.player1.triggerAbility(this.widowsFord);
    });

    it('places an attachment that enters your discard pile in shadows with a shadow token, and gives it shadow (X)', function () {
        expect(this.hiddenInShadow.location).toBe('shadows');
        expect(this.hiddenInShadow.tokens.shadow).toBe(1);
        expect(this.hiddenInShadow.hasKeyword('Shadow (1)')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
