describe('Acolyte of the Shadow (ChoS)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Acolyte of the Shadow (ChoS)']
            },
            player2: { shadows: ['Ser Andrey Dalt'] }
        });
    });

    it('gains insight while an opponent controls a card in shadows', function () {
        expect(this.acolyteOfTheShadow.hasKeyword('Insight')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
