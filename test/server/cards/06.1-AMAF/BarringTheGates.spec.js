describe('Barring the Gates', function () {
    describe('during the marshaling phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { plot: 'Barring the Gates', hand: ['Hedge Knight'] }
            });
        });

        it('still lets characters be marshaled', function () {
            this.player1.clickCard(this.hedgeKnight);

            expect(this.hedgeKnight.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('during the challenges phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { plot: 'Barring the Gates' },
                player2: { faction: 'lannister', gold: 2, hand: ['Burned Men'] }
            });

            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.burnedMen);
        });

        it('stops card abilities putting characters into play, for every player', function () {
            expect(this.burnedMen.location).toBe('hand');
            expect(this.player2Object.gold).toBe(2);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when you marshal a duplicate of a character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    plot: 'Barring the Gates',
                    inPlay: ['Arya Stark (Core)'],
                    hand: ['Arya Stark (Core)', 'Hedge Knight']
                }
            });
            this.aryaInPlay = this.player1.findCardByName('Arya Stark', 'play area');
            this.aryaInHand = this.player1.findCardByName('Arya Stark', 'hand');
        });

        it('does not stop it', function () {
            this.player1.clickCard(this.aryaInHand);

            expect(this.aryaInHand.location).toBe('duplicate');
            expect(this.aryaInPlay.dupes).toContain(this.aryaInHand);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
