describe("Olenna's Cunning", function () {
    describe('after you win an intrigue challenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Maester Luwin'],
                    hand: ["Olenna's Cunning"],
                    deck: ['Nightmares', 'Hedge Knight']
                }
            });
            this.unopposedChallenge(this.player1, 'Intrigue', this.maesterLuwin);
            this.player1.triggerAbility(this.olennasCunning);
            this.player2.clickPrompt('Character');
            this.nightmares = this.player1.findCardByName('Nightmares', 'draw deck');
            this.player1.clickCard(this.nightmares);
        });

        it('has the losing opponent name a cardtype, then adds a card of another type from your deck to your hand', function () {
            expect(this.nightmares.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
