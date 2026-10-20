describe('Mhysa', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'targaryen',
                    hand: ['Mhysa'],
                    inPlay: ['Taena Merryweather (LoCR)', 'Hedge Knight']
                }
            });

            this.player1.clickCard(this.mhysa);
        });

        it('can only be attached to a Lady character', function () {
            expect(this.player1).toBeAbleToSelect(this.taenaMerryweather);
            expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);

            this.player1.clickCard(this.taenaMerryweather);

            expect(this.taenaMerryweather.attachments).toContain(this.mhysa);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while attached', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'targaryen',
                    inPlay: [
                        { card: 'Taena Merryweather (LoCR)', attachments: ['Mhysa'] },
                        'House Maester'
                    ]
                }
            });
        });

        it('stops the character kneeling and gives it +1 STR for each attacking character in your first [power] challenge', function () {
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.taenaMerryweather);
            this.player1.clickCard(this.houseMaester);
            this.player1.clickPrompt('Done');

            expect(this.taenaMerryweather.kneeled).toBe(false);
            expect(this.houseMaester.kneeled).toBe(true);
            expect(this.taenaMerryweather.getStrength()).toBe(4);
            expect(this.player1).toHavePrompt('Initiate an action');
        });

        it('has no effect in other challenges', function () {
            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.taenaMerryweather);
            this.player1.clickPrompt('Done');

            expect(this.taenaMerryweather.kneeled).toBe(true);
            expect(this.taenaMerryweather.getStrength()).toBe(2);
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });
});
