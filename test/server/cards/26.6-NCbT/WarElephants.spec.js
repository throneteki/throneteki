describe('War Elephants', function () {
    it('costs 1 less to ambush for each Commander character you control', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['War Elephants'], inPlay: ['Old Bear Mormont (Core)'], gold: 10 }
        });
        this.player1.clickCard(this.warElephants);
        expect(this.warElephants.location).toBe('play area');
        expect(this.player1Object.gold).toBe(3);
    });

    it('cannot be marshaled', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['War Elephants'], gold: 10 }
        });
        expect(this.player1Object.canPutIntoPlay(this.warElephants, 'marshal')).toBe(false);
    });
});
