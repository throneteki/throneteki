describe('Secret Pact', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Secret Pact'],
                    inPlay: ['House Dayne Knight']
                },
                player2: {
                    inPlay: ['Tumblestone Knight']
                }
            });

            this.player1.clickCard(this.secretPact);
        });

        it('can only be attached to a non-[martell] character, which gains renown', function () {
            expect(this.player1).not.toBeAbleToSelect(this.houseDayneKnight);

            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.tumblestoneKnight.hasKeyword('Renown')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the attached character could attack you', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player2: {
                    inPlay: [
                        {
                            card: 'Tumblestone Knight',
                            attachments: [{ card: 'Secret Pact', owner: 'player1' }]
                        },
                        'Bastard in Hiding'
                    ]
                }
            });

            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Power');
        });

        it('cannot be declared as an attacker in challenges against you', function () {
            expect(this.player2).not.toBeAbleToSelect(this.tumblestoneKnight);

            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickPrompt('Done');
            this.skipActionWindow();

            expect(this.player2).isReadyToTakeAction();
        });
    });
});
