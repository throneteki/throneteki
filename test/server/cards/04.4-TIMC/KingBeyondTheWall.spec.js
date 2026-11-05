describe('King Beyond the Wall', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['King Beyond the Wall'],
                    inPlay: ['Mance Rayder', 'Tumblestone Knight']
                }
            });

            this.player1.clickCard(this.kingBeyondTheWall);
        });

        it('can only be attached to a Wildling character, which gains the King trait', function () {
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

            this.player1.clickCard(this.manceRayder);

            expect(this.manceRayder.hasTrait('King')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the attached character attacks a player with more power', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [{ card: 'Mance Rayder', attachments: ['King Beyond the Wall'] }]
                },
                player2: {
                    power: 3
                }
            });

            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.manceRayder);
            this.player1.clickPrompt('Done');
        });

        it('raises the claim on your revealed plot by 1', function () {
            expect(this.player1Object.getClaim()).toBe(2);

            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
