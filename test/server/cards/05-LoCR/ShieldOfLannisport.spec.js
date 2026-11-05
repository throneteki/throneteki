describe('Shield of Lannisport', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'lannister',
                    hand: ['Shield of Lannisport'],
                    inPlay: ['Tommen Baratheon (LoCR)', 'Lannisport Moneylender', 'Hedge Knight']
                }
            });

            this.player1.clickCard(this.shieldOfLannisport);
        });

        it('can only be attached to a [lannister] Lord or Lady', function () {
            expect(this.player1).toBeAbleToSelect(this.tommenBaratheon);
            expect(this.player1).not.toBeAbleToSelect(this.lannisportMoneylender);
            expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);

            this.player1.clickCard(this.tommenBaratheon);

            expect(this.tommenBaratheon.attachments).toContain(this.shieldOfLannisport);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while you control no other Lord or Lady with printed cost 4 or higher', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'lannister',
                    inPlay: [
                        { card: 'Tommen Baratheon (LoCR)', attachments: ['Shield of Lannisport'] },
                        'Taena Merryweather (LoCR)'
                    ]
                }
            });
        });

        it('gives the attached character +2 STR and renown, and gives +1 income', function () {
            expect(this.tommenBaratheon.getStrength()).toBe(4);
            expect(this.tommenBaratheon.hasKeyword('renown')).toBe(true);
            expect(this.taenaMerryweather.getStrength()).toBe(2);
            expect(this.player1Object.getIncome()).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while you control another Lord or Lady with printed cost 4 or higher', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'lannister',
                    inPlay: [
                        { card: 'Tommen Baratheon (LoCR)', attachments: ['Shield of Lannisport'] },
                        'Ser Harys Swyft (FH)'
                    ]
                }
            });
        });

        it('gives no STR or renown', function () {
            expect(this.tommenBaratheon.getStrength()).toBe(2);
            expect(this.tommenBaratheon.hasKeyword('renown')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
