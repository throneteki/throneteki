describe('Ser Pounce', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Ser Pounce'],
                    inPlay: [
                        'Joffrey Baratheon (Core)',
                        'Ser Jaime Lannister (Core)',
                        'Tumblestone Knight'
                    ]
                }
            });

            this.player1.clickCard(this.serPounce);
        });

        it('can only be attached to a unique character with printed cost 3 or lower', function () {
            expect(this.player1).toBeAbleToSelect(this.joffreyBaratheon);
            expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

            this.player1.clickCard(this.joffreyBaratheon);

            expect(this.joffreyBaratheon.hasIcon('intrigue')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the attached character attacks in an [intrigue] challenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [{ card: 'Joffrey Baratheon (Core)', attachments: ['Ser Pounce'] }]
                }
            });

            this.unopposedChallenge(this.player1, 'Intrigue', this.joffreyBaratheon);
        });

        it('does not kneel', function () {
            expect(this.joffreyBaratheon.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
