describe('Highgarden Jester', function () {
    it('automatically returns a random hand card to the deck after drawing with insight', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Highgarden Jester'],
                hand: ['Hedge Knight'],
                drawDeck: ['Castle Guard']
            },
            player2: { hand: ['Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.highgardenJester);
        expect(this.player1Object.hand.length).toBe(1);
        const returned = this.player1Object.drawDeck[0];
        expect([this.hedgeKnight, this.castleGuard]).toContain(returned);
        expect(returned.location).toBe('draw deck');
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    it('returns the only card in hand when insight draws into an empty hand', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Highgarden Jester'], drawDeck: ['Castle Guard'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.highgardenJester);
        expect(this.player1Object.hand.length).toBe(0);
        expect(this.player1Object.drawDeck[0]).toBe(this.castleGuard);
        expect(this.player1).isReadyToTakeAction();
    });

    for (const foolPlayer of ['player1', 'player2']) {
        it(`requires you to choose the hand card when another Fool belongs to ${foolPlayer}`, function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [
                        'Highgarden Jester',
                        ...(foolPlayer === 'player1' ? ['Ser Dontos Hollard'] : [])
                    ],
                    hand: ['Hedge Knight'],
                    drawDeck: ['Castle Guard']
                },
                player2: {
                    inPlay: foolPlayer === 'player2' ? ['Ser Dontos Hollard'] : [],
                    hand: ['Tumblestone Knight']
                }
            });
            this.unopposedChallenge(this.player1, 'Power', this.highgardenJester);
            expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).toBeAbleToSelect(this.castleGuard);
            expect(this.player1).not.toBeAbleToSelect(this.highgardenJester);
            expect(this.player1).not.toBeAbleToSelect(this.serDontosHollard);
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).not.toHavePromptButton('Done');
            expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
            this.player1.clickCard(this.hedgeKnight);
            expect(this.player1Object.drawDeck[0]).toBe(this.hedgeKnight);
            expect(this.castleGuard.location).toBe('hand');
            expect(this.tumblestoneKnight.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    }

    it('does not return cards drawn by a different character using insight', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Highgarden Jester', 'Arianne Martell (JtO)'],
                drawDeck: ['Castle Guard']
            }
        });
        this.unopposedChallenge(this.player1, 'Power', this.arianneMartell);
        expect(this.castleGuard.location).toBe('hand');
        expect(this.player1Object.hand.length).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
