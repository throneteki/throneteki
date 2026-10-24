describe('Paid Off', function () {
    function setup(gold) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Courtesan of the Rose'] },
            player2: {
                inPlay: [
                    { card: 'Hedge Knight', attachments: [{ card: 'Paid Off', owner: 'player1' }] }
                ],
                gold
            }
        });
        this.startingGold = this.player1Object.gold;
        this.unopposedChallenge(this.player1, 'Intrigue', this.courtesanOfTheRose);
        this.player1.triggerAbility('Paid Off');
    }

    it('kneels the attached character after you win an intrigue challenge, and its controller may pay you 1 gold to stand it', function () {
        setup.call(this, 1);
        expect(this.hedgeKnight.kneeled).toBe(true);
        this.player2.clickPrompt('Yes');
        expect(this.hedgeKnight.kneeled).toBe(false);
        expect(this.player2Object.gold).toBe(0);
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
    });

    it('leaves it kneeling if they do not pay', function () {
        setup.call(this, 1);
        this.player2.clickPrompt('No');
        expect(this.hedgeKnight.kneeled).toBe(true);
        expect(this.player2Object.gold).toBe(1);
    });

    it('leaves it kneeling if they cannot pay', function () {
        setup.call(this, 0);
        expect(this.hedgeKnight.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
