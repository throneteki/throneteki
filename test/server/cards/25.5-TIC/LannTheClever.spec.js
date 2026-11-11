describe('Lann the Clever', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Casterly Rock (Core)', attachments: ['Lann the Clever'] },
                    'Cersei Lannister (Core)'
                ]
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.cerseiLannister);
        this.startingGold = this.player1Object.gold;
        this.player1.triggerAbility(this.lannTheClever);
    });

    it('kneels and returns a participating lannister character to your hand to gain 3 gold after you win an intrigue challenge', function () {
        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickPrompt('Gain 3 gold');

        expect(this.cerseiLannister.location).toBe('hand');
        expect(this.player1Object.gold).toBe(this.startingGold + 3);
        expect(this.player1).isReadyToTakeAction();
    });
});
