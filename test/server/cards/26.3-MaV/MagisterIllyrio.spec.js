describe('Magister Illyrio (MaV)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Magister Illyrio (MaV)'],
                shadows: ['Meera Reed (R)']
            },
            player2: {
                shadows: ['Ser Andrey Dalt']
            }
        });
    });

    it('gives +1 income', function () {
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gains 1 gold for every 2 cards in shadows after the challenges phase begins', function () {
        this.completeMarshalPhase();
        this.player1.triggerAbility(this.magisterIllyrio);

        expect(this.player1Object.gold).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
