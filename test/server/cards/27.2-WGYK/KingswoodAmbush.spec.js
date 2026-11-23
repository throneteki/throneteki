describe('Kingswood Ambush', function () {
    describe('during the marshaling phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'lannister',
                    plot: 'Kingswood Ambush',
                    hand: ['Burned Men', 'Little Bird (Core)'],
                    inPlay: ['Bastard in Hiding']
                }
            });
        });

        it('stops you marshaling characters', function () {
            this.player1.clickCard(this.burnedMen);

            expect(this.burnedMen.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('lets you marshal other cards', function () {
            this.player1.clickCard(this.littleBird);
            this.player1.clickCard(this.bastardInHiding);

            expect(this.littleBird.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('during the challenges phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'lannister',
                    plot: 'Kingswood Ambush',
                    gold: 0,
                    hand: ['Burned Men']
                },
                player2: {
                    faction: 'lannister',
                    gold: 0,
                    hand: ["Widow's Wail"],
                    inPlay: ['Bastard in Hiding']
                }
            });
        });

        it('reduces the cost to ambush your cards by 2', function () {
            this.player1.clickCard(this.burnedMen);

            expect(this.burnedMen.location).toBe('play area');
            expect(this.player1Object.gold).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it("does not reduce the cost to ambush an opponent's cards", function () {
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.widowsWail);

            expect(this.widowsWail.location).toBe('hand');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when you marshal a duplicate of a character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    plot: 'Kingswood Ambush',
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
            this.player1.clickCard(this.hedgeKnight);
            expect(this.hedgeKnight.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
