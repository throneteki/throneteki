describe('Spare Boot', function () {
    function setup({ sealKneeling = false, birdKneeling = false } = {}) {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    {
                        card: 'Spare Boot',
                        attachments: [{ card: 'Little Bird (Core)', kneeling: birdKneeling }]
                    },
                    {
                        card: 'Bran Stark (Core)',
                        attachments: [
                            { card: 'Seal of the Hand', kneeling: sealKneeling },
                            "Syrio's Training"
                        ]
                    }
                ]
            }
        });
        this.player1.clickMenu(this.spareBoot, 'Stand and move attachment');
    }

    it('moves an attachment on a character you control to Spare Boot', function () {
        setup.call(this);
        this.player1.clickCard(this.syriosTraining);
        expect(this.syriosTraining.parent).toBe(this.spareBoot);
    });

    describe('when the attachment cannot be moved but is knelt', function () {
        beforeEach(function () {
            setup.call(this, { sealKneeling: true });
        });

        it('stands the attachment without moving it', function () {
            expect(this.player1).toAllowSelect(this.sealOfTheHand);
            this.player1.clickCard(this.sealOfTheHand);
            expect(this.sealOfTheHand.kneeled).toBe(false);
            expect(this.sealOfTheHand.parent).toBe(this.branStark);
        });
    });

    describe('when the attachment is on Spare Boot already but is knelt', function () {
        beforeEach(function () {
            setup.call(this, { birdKneeling: true });
        });

        it('stands the attachment without moving it', function () {
            expect(this.player1).toAllowSelect(this.littleBird);
            this.player1.clickCard(this.littleBird);
            expect(this.littleBird.kneeled).toBe(false);
            expect(this.littleBird.parent).toBe(this.spareBoot);
        });
    });

    it('cannot choose an attachment it can neither move nor stand', function () {
        setup.call(this);
        expect(this.player1).not.toAllowSelect(this.sealOfTheHand);
        expect(this.player1).not.toAllowSelect(this.littleBird);
    });
});
