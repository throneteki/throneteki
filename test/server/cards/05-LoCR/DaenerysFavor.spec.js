describe("Daenerys's Favor", function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ["Daenerys's Favor"],
                    inPlay: ['Targaryen Loyalist', 'Tumblestone Knight']
                }
            });

            this.player1.clickCard(this.daeneryssFavor);
        });

        it('can only be attached to a [targaryen] character', function () {
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

            this.player1.clickCard(this.targaryenLoyalist);

            expect(this.daeneryssFavor.parent).toBe(this.targaryenLoyalist);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while the attached character participates', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [{ card: 'Targaryen Loyalist', attachments: ["Daenerys's Favor"] }]
                },
                player2: {
                    inPlay: ['Tumblestone Knight']
                }
            });

            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.targaryenLoyalist);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.tumblestoneKnight);
            this.player2.clickPrompt('Done');
        });

        it('gives each other participating character -1 STR while the attached character participates', function () {
            expect(this.tumblestoneKnight.getStrength()).toBe(1);
            expect(this.targaryenLoyalist.getStrength()).toBe(1);

            this.skipActionWindow();

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
