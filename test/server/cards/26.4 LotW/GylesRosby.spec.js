describe('Gyles Rosby', function () {
    describe('with no gold in your gold pool', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'lannister',
                    gold: 0,
                    inPlay: [{ card: 'Gyles Rosby', dupes: 1 }]
                }
            });
        });

        it('stays in play outside the challenges phase', function () {
            expect(this.gylesRosby.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('is killed when the challenges phase begins, and cannot be saved', function () {
            this.completeMarshalPhase();

            expect(this.gylesRosby.location).toBe('dead pile');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 kills Gyles Rosby as they have no gold in their gold pool'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when you spend your last gold during the challenges phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'lannister',
                    gold: 1,
                    hand: ['Hear Me Roar!', 'Lannisport Merchant'],
                    inPlay: ['Gyles Rosby']
                }
            });
        });

        it('is killed', function () {
            expect(this.gylesRosby.location).toBe('play area');

            this.player1.clickCard(this.hearMeRoar);
            this.player1.clickCard(this.lannisportMerchant);

            expect(this.player1Object.gold).toBe(0);
            expect(this.gylesRosby.location).toBe('dead pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    it('gives +2 income', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'lannister',
                inPlay: ['Gyles Rosby']
            }
        });

        expect(this.player1Object.gold).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
