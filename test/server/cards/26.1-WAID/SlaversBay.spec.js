describe("Slaver's Bay", function () {
    function attack(location, challengeType, attackers) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["Slaver's Bay", location, ...attackers] }
        });
        this.player1.clickPrompt(challengeType);
        for (const name of attackers) {
            this.player1.clickCard(this.player1.findCardByName(name));
        }
        this.player1.clickPrompt('Done');
    }

    it('kills each participating character with 0 STR during military challenges while you control Astapor', function () {
        attack.call(this, 'Astapor', 'Military', ['Bronn (HMW)', 'Hedge Knight']);
        expect(this.bronn.location).toBe('dead pile');
        expect(this.hedgeKnight.location).toBe('play area');
    });

    it('kills them during intrigue challenges while you control Yunkai', function () {
        attack.call(this, 'Yunkai', 'Intrigue', ['Bronn (HMW)']);
        expect(this.bronn.location).toBe('dead pile');
    });

    it('does not kill characters with STR during power challenges while you control Meereen', function () {
        attack.call(this, 'Meereen (R)', 'Power', ['Courtesan of the Rose']);
        expect(this.courtesanOfTheRose.location).toBe('play area');
    });
});
