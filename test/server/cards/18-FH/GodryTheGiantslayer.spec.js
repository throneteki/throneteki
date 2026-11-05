describe('Godry the Giantslayer', function () {
    describe('after you marshal another Knight', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: [{ card: 'Godry the Giantslayer (FH)', gold: 4 }],
                    hand: ['Hedge Knight']
                }
            });
            expect(this.godryTheGiantslayer.getStrength()).toBe(4);
            expect(this.godryTheGiantslayer.hasKeyword('Intimidate')).toBe(false);
            this.player1.clickCard(this.hedgeKnight);
            this.player1.triggerAbility(this.godryTheGiantslayer);
        });

        it('gains 1 gold, and gains intimidate with 5 or more gold', function () {
            expect(this.godryTheGiantslayer.gold).toBe(5);
            expect(this.godryTheGiantslayer.getStrength()).toBe(5);
            expect(this.godryTheGiantslayer.hasKeyword('Intimidate')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
