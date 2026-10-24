describe('Ice (FUtG)', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Ice (FUtG)'],
                    inPlay: ['Robb Stark (AtSK)', 'Tumblestone Knight', 'Khal Drogo (Core)']
                }
            });

            this.player1.clickCard(this.ice);
        });

        it('can only be attached to a unique [stark] character, which gets +2 STR', function () {
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.khalDrogo);

            this.player1.clickCard(this.robbStark);

            expect(this.robbStark.getStrength()).toBe(this.robbStark.cardData.strength + 2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('after a character is saved', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [{ card: 'Robb Stark (AtSK)', attachments: ['Ice (FUtG)'] }]
                },
                player2: {
                    inPlay: [{ card: 'Sansa Stark (WotN)', attachments: ['Bodyguard'] }]
                }
            });

            this.unopposedChallenge(this.player1, 'Military', this.robbStark);
            this.player2.clickCard(this.sansaStark);
            this.player2.triggerAbility(this.bodyguard);
        });

        it('kneels to kill it', function () {
            this.player1.triggerAbility(this.ice);

            expect(this.ice.kneeled).toBe(true);
            expect(this.sansaStark.location).toBe('dead pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
