describe('Ward (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'stark',
                hand: ['Ward (R)']
            },
            player2: {
                inPlay: [
                    'Samwell Tarly (Core)',
                    'Grand Maester Pycelle (Core)',
                    'Ser Denys Mallister',
                    'Ser Davos Seaworth (TTWDFL)',
                    'Tumblestone Knight'
                ]
            }
        });

        this.player1.clickCard(this.ward);
    });

    it('attaches only to a unique character with printed cost 4 or lower', function () {
        expect(this.player1).toBeAbleToSelect(this.samwellTarly);
        expect(this.player1).toBeAbleToSelect(this.grandMaesterPycelle);
        expect(this.player1).toBeAbleToSelect(this.serDenysMallister);
        expect(this.player1).not.toBeAbleToSelect(this.serDavosSeaworth);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.serDenysMallister);

        expect(this.ward.parent).toBe(this.serDenysMallister);
        expect(this.ward.hasKeyword('Terminal')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    describe('on a character with printed cost 3 or higher', function () {
        beforeEach(function () {
            this.player1.clickCard(this.grandMaesterPycelle);
        });

        it('takes control of the attached character and gives it prized 2', function () {
            expect(this.grandMaesterPycelle).toBeControlledBy(this.player1);
            expect(this.grandMaesterPycelle.getPrizedValue()).toBe(2);
            expect(this.samwellTarly).toBeControlledBy(this.player2);
            expect(this.samwellTarly.getPrizedValue()).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('on a character with printed cost 2 or lower', function () {
        beforeEach(function () {
            this.player1.clickCard(this.samwellTarly);
        });

        it('takes control of the attached character and gives it prized 1', function () {
            expect(this.samwellTarly).toBeControlledBy(this.player1);
            expect(this.samwellTarly.getPrizedValue()).toBe(1);
            expect(this.grandMaesterPycelle.getPrizedValue()).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
