describe('Silver Hair Net', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Silver Hair Net'],
                    inPlay: ['Sansa Stark (WotN)', 'Tumblestone Knight']
                }
            });

            this.player1.clickCard(this.silverHairNet);
        });

        it('can only be attached to a Lady character, which gains stealth', function () {
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

            this.player1.clickCard(this.sansaStark);

            expect(this.sansaStark.hasKeyword('Stealth')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while the attached character participates', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [{ card: 'Sansa Stark (WotN)', attachments: ['Silver Hair Net'] }],
                    hand: ['Nightmares']
                },
                player2: {
                    inPlay: ['House Maester']
                }
            });

            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.sansaStark);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.nightmares);
            this.player1.clickCard(this.houseMaester);
        });

        it('reduces the cost of each event you play by 1', function () {
            expect(this.nightmares.location).toBe('discard pile');
            expect(this.player1Object.gold).toBe(5);

            this.player2.clickPrompt('Pass');
            this.player1.clickPrompt('Pass');
            this.player2.clickPrompt('Done');
            this.skipActionWindow();

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
