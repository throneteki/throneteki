describe('Tokar', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Tokar'],
                    inPlay: [
                        { card: 'Targaryen Loyalist', attachments: ['Little Bird (Core)'] },
                        'Tumblestone Knight'
                    ]
                }
            });

            this.player1.clickCard(this.tokar);
        });

        it('can only be attached to a [targaryen] character, which gets +1 STR for each attachment', function () {
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

            this.player1.clickCard(this.targaryenLoyalist);

            expect(this.targaryenLoyalist.getStrength()).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while the attached character participates', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [
                        { card: 'Targaryen Loyalist', attachments: ['Tokar'] },
                        'Khal Drogo (Core)'
                    ]
                }
            });

            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.targaryenLoyalist);
            this.player1.clickCard(this.khalDrogo);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
        });

        it('stops each character without attachments gaining power', function () {
            expect(this.khalDrogo.power).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
