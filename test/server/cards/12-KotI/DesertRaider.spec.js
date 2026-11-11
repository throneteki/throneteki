describe('Desert Raider', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { deadPile: ['Desert Raider (KotI)'] },
            player2: { inPlay: ['Courtesan of the Rose'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Power', this.courtesanOfTheRose);
        this.startingPower = this.courtesanOfTheRose.power;
        this.player1.triggerAbility('Desert Raider');
        this.player1.clickCard(this.courtesanOfTheRose);
        this.player1.clickPrompt('Power');
    });

    it('comes into play from your dead pile after you lose a challenge, and takes an icon from a winning character that gains 1 power', function () {
        expect(this.desertRaider.location).toBe('play area');
        expect(this.courtesanOfTheRose.power).toBe(this.startingPower + 1);
        expect(this.courtesanOfTheRose.hasIcon('power')).toBe(false);
        expect(this.desertRaider.hasIcon('power')).toBe(true);
    });
});
