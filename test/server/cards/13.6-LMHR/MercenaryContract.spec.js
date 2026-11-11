describe('Mercenary Contract', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Tumblestone Knight', attachments: ['Mercenary Contract'] }]
            }
        });
    });

    it('gives the attached character the Mercenary trait, and pays 1 gold and kneels to stand it after it wins attacking', function () {
        expect(this.tumblestoneKnight.hasTrait('Mercenary')).toBe(true);

        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        this.startingGold = this.player1Object.gold;
        this.player1.triggerAbility(this.mercenaryContract);

        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.mercenaryContract.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(this.startingGold - 1);
        expect(this.player1).isReadyToTakeAction();
    });
});
