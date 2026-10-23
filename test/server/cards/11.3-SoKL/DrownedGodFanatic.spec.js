describe('Drowned God Fanatic (SoKL)', function () {
    it('kills a character to put itself into play from your dead pile', function () {
        this.setupTest({
            player1: {
                faction: 'greyjoy',
                inPlay: ['Hedge Knight'],
                deadPile: ['Drowned God Fanatic (SoKL)']
            }
        });
        this.player1.clickCard(this.drownedGodFanatic);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.drownedGodFanatic.location).toBe('play area');
    });

    it("places itself in your dead pile from your hand to cancel an opponent's triggered character ability", function () {
        this.setupTest({
            firstPlayer: 'player2',
            player1: { faction: 'greyjoy', hand: ['Drowned God Fanatic (SoKL)'] },
            player2: { hand: ['Littlefinger (Core)'], gold: 5 }
        });
        this.player2.clickCard(this.littlefinger);
        this.player2.triggerAbility('Littlefinger');
        this.player1.triggerAbility('Drowned God Fanatic');
        expect(this.drownedGodFanatic.location).toBe('dead pile');
        expect(this.player2Object.hand.length).toBe(0);
    });
});
