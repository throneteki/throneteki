describe('Marya Seaworth', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'baratheon',
                inPlay: ['Marya Seaworth', 'Arya Stark (Core)'],
                gold: 1
            },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.aryaStark);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.maryaSeaworth);
    });

    it('pays 1 gold to kneel a character after it is bypassed using stealth', function () {
        expect(this.player1Object.gold).toBe(0);
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
