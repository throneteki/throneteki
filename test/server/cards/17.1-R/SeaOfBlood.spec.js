describe('Sea of Blood (R)', function () {
    it('discards a blood token to reduce the cost of the next event you play this phase by 2', function () {
        this.setupTest({
            player1: {
                faction: 'greyjoy',
                agenda: { card: 'Sea of Blood (R)', tokens: { blood: 1 } },
                inPlay: ['Dagmer Cleftjaw (TS)'],
                hand: ['Every Captain is a King'],
                gold: 0
            }
        });
        this.player1.clickCard(this.seaOfBlood);
        expect(this.seaOfBlood.tokens.blood).toBeUndefined();
        this.player1.clickCard(this.everyCaptainIsAKing);
        expect(this.everyCaptainIsAKing.location).toBe('discard pile');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('places a blood token and searches the top 10 cards of your deck for an event after you win a military challenge by 5 or more STR', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                agenda: 'Sea of Blood (R)',
                inPlay: ['Robb Stark (Core)'],
                drawDeck: ['Every Captain is a King']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.robbStark);
        this.player1.triggerAbility('Sea of Blood');
        this.player1.clickCard(this.everyCaptainIsAKing);
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.seaOfBlood.tokens.blood).toBe(1);
        expect(this.everyCaptainIsAKing.location).toBe('hand');
    });
});
