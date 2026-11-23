describe('The Myrish Eye', function () {
    describe('while there are no cards in shadows', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [{ card: 'Tumblestone Knight', attachments: ['The Myrish Eye'] }]
                }
            });
        });

        it('gives the attached character insight', function () {
            expect(this.tumblestoneKnight.hasKeyword('insight')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('after a challenge the attached character wins', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [{ card: 'Tumblestone Knight', attachments: ['The Myrish Eye'] }]
                },
                player2: { shadows: ['All the Gold in Casterly Rock'] }
            });

            this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
            this.player1.triggerAbility(this.theMyrishEye);
        });

        it("kneels to reveal a card in the losing opponent's shadows, discarding it if it is an event", function () {
            this.player1.clickCard(this.allTheGoldInCasterlyRock);

            expect(this.theMyrishEye.kneeled).toBe(true);
            expect(this.allTheGoldInCasterlyRock.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when Sweetrobin removes the revealed card', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [
                        { card: 'Tumblestone Knight', attachments: ['The Myrish Eye'] },
                        'Sweetrobin'
                    ]
                },
                player2: { plot: 'Sneak Attack', shadows: ['Rhymes With Meek'] }
            });

            this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
            this.player1.triggerAbility(this.theMyrishEye);
            this.player1.clickCard(this.rhymesWithMeek);
            this.player1.triggerAbility(this.sweetrobin);
        });

        it('has nothing left to discard', function () {
            expect(this.theMyrishEye.kneeled).toBe(true);
            expect(this.rhymesWithMeek.location).toBe('out of game');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
