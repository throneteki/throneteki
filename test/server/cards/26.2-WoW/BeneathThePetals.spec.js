describe('Beneath the Petals', function () {
    it('gives a character with shadow insight and a challenge icon of your choice', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Nighttime Marauders (R)'], shadows: ['Beneath the Petals (WoW)'] }
        });
        this.player1.clickCard(this.beneathThePetals);
        this.player1.clickCard(this.nighttimeMarauders);
        this.player1.clickPrompt('Intrigue');
        expect(this.nighttimeMarauders.hasIcon('intrigue')).toBe(true);
        expect(this.nighttimeMarauders.hasKeyword('Insight')).toBe(true);
    });

    it('is placed in shadows and gains 1 gold when revealed from your deck', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Hightower Spy'], drawDeck: ['Beneath the Petals (WoW)'] }
        });
        this.player1.clickCard(this.hightowerSpy);
        this.player1.triggerAbility('Hightower Spy');
        this.player1.clickCard(this.hightowerSpy);
        this.startingGold = this.player1Object.gold;
        this.player1.triggerAbility('Beneath the Petals');
        expect(this.beneathThePetals.location).toBe('shadows');
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
    });
});
