describe('Drowned God Fanatic (R)', function () {
    it('kills a Greyjoy character you own and control to put itself into play from your dead pile', function () {
        this.setupTest({
            player1: {
                faction: 'greyjoy',
                inPlay: ['Drowned Men', 'Hedge Knight'],
                deadPile: ['Drowned God Fanatic (R)']
            }
        });
        this.player1.clickCard(this.drownedGodFanatic);
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
        this.player1.clickCard(this.drownedMen);
        expect(this.drownedMen.location).toBe('dead pile');
        expect(this.drownedGodFanatic.location).toBe('play area');
    });

    it("discards itself from your hand to cancel an opponent's triggered character ability", function () {
        this.setupTest({
            firstPlayer: 'player2',
            player1: { faction: 'greyjoy', hand: ['Drowned God Fanatic (R)'] },
            player2: { hand: ['Littlefinger (Core)'], gold: 5 }
        });
        this.player2.clickCard(this.littlefinger);
        this.player2.triggerAbility('Littlefinger');
        this.player1.triggerAbility('Drowned God Fanatic');
        expect(this.drownedGodFanatic.location).toBe('discard pile');
        expect(this.player2Object.hand.length).toBe(0);
    });
});
