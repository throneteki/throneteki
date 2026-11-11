describe('The Great Sept of Baelor', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: [{ card: 'The Great Sept of Baelor', gold: 1 }] },
            player2: { hand: ['Khal Drogo (Core)'], gold: 6 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.khalDrogo);
        this.player1.triggerAbility(this.theGreatSeptOfBaelor);
    });

    it("kneels and discards 1 gold to blank an opponent's character until the end of the round after it enters play", function () {
        expect(this.theGreatSeptOfBaelor.kneeled).toBe(true);
        expect(this.theGreatSeptOfBaelor.gold).toBe(0);
        expect(this.khalDrogo.isBlankExcludingTraits()).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
