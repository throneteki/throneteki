describe('No Song So Sweet', function () {
    describe('during a power challenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Vanguard Lancer', 'Bastard in Hiding'],
                    hand: ['No Song So Sweet (HMW)']
                }
            });
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.vanguardLancer);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.noSongSoSweet);
            this.player1.clickCard(this.bastardInHiding);
        });

        it('has a standing baratheon character you control participate on your side', function () {
            expect(this.bastardInHiding.isAttacking()).toBe(true);
        });
    });

    describe('after you play a Song event', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Tumblestone Knight'],
                    hand: ['"Lord Renly\'s Ride"'],
                    discard: ['No Song So Sweet (HMW)']
                }
            });
            this.goldBefore = this.player1Object.gold;
            this.player1.clickCard(this.lordRenlysRide);
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.triggerAbility(this.noSongSoSweet);
        });

        it('pays 1 gold to return it from your discard pile to your hand', function () {
            expect(this.noSongSoSweet.location).toBe('hand');
        });
    });
});
