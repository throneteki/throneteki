describe('Legacy of the Watch', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: [
                    { card: 'Castle Black (BtB)', attachments: ['Legacy of the Watch'] },
                    'Ranging Party',
                    'Ranging Party'
                ]
            },
            player2: { inPlay: ['Courtesan of the Rose'] }
        });
        const rangers = this.player1.filterCardsByName('Ranging Party', 'play area');
        this.player1.clickPrompt('Power');
        rangers.forEach((card) => this.player1.clickCard(card));
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.courtesanOfTheRose);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('Legacy of the Watch');
    });

    it('gains 1 power for your faction after you win by 5 with 2 participating Rangers', function () {
        expect(this.player1Object.faction.power).toBe(1);
    });
});
