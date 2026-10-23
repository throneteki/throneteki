describe('Paid Off', function () {
    function setup(test, gold) {
        test.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Courtesan of the Rose'] },
            player2: {
                inPlay: [
                    { card: 'Hedge Knight', attachments: [{ card: 'Paid Off', owner: 'player1' }] }
                ],
                gold
            }
        });
        test.startingGold = test.player1Object.gold;
        test.unopposedChallenge(test.player1, 'Intrigue', test.courtesanOfTheRose);
        test.player1.triggerAbility('Paid Off');
    }

    it('kneels the attached character after you win an intrigue challenge, and its controller may pay you 1 gold to stand it', function () {
        setup(this, 1);
        expect(this.hedgeKnight.kneeled).toBe(true);
        this.player2.clickPrompt('Yes');
        expect(this.hedgeKnight.kneeled).toBe(false);
        expect(this.player2Object.gold).toBe(0);
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
    });

    it('leaves it kneeling if they do not pay', function () {
        setup(this, 1);
        this.player2.clickPrompt('No');
        expect(this.hedgeKnight.kneeled).toBe(true);
        expect(this.player2Object.gold).toBe(1);
    });

    it('leaves it kneeling if they cannot pay', function () {
        setup(this, 0);
        expect(this.hedgeKnight.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
