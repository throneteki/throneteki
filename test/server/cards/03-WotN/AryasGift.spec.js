describe("Arya's Gift", function () {
    function setup(attachment) {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    {
                        card: 'Bran Stark (Core)',
                        attachments: [{ card: attachment, owner: 'player2' }]
                    },
                    'Winterfell Steward'
                ],
                hand: ["Arya's Gift"]
            }
        });
        this.player1.clickCard(this.aryasGift);
    }

    describe('with a normal attachment', function () {
        beforeEach(function () {
            setup.call(this, 'Milk of the Poppy');
            this.player1.clickCard(this.milkOfThePoppy);
            this.player1.clickCard(this.winterfellSteward);
        });

        it('moves the attachment to the new parent', function () {
            expect(this.milkOfThePoppy.parent).toBe(this.winterfellSteward);
            expect(this.branStark.attachments).not.toContain(this.milkOfThePoppy);
        });

        it('applies its effects to the new parent and unapplies them from the old one', function () {
            expect(this.winterfellSteward.isAnyBlank()).toBe(true);
            expect(this.branStark.isAnyBlank()).toBe(false);
        });
    });

    describe('with an opponent-only attachment', function () {
        beforeEach(function () {
            setup.call(this, 'Fishing Net');
            this.player1.clickCard(this.fishingNet);
            this.player1.clickCard(this.winterfellSteward);
        });

        it('moves the attachment to the new parent', function () {
            expect(this.fishingNet.parent).toBe(this.winterfellSteward);
            expect(this.branStark.attachments).not.toContain(this.fishingNet);
            expect(this.fishingNet).toBeControlledBy(this.player2);
        });
    });
});
