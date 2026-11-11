describe("Maiden's Bane", function () {
    for (const attacker of ['House Maester', 'Captain Groleo']) {
        it(`stands an attacking ${attacker} and stands the ship only for a Captain`, function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ["Maiden's Bane", attacker, { card: 'Handmaiden', kneeling: true }]
                },
                player2: { inPlay: [{ card: 'Ranging Party', kneeling: true }] }
            });
            const card = this.player1.findCardByName(attacker, 'play area');
            this.unopposedChallenge(
                this.player1,
                attacker === 'House Maester' ? 'Power' : 'Intrigue',
                card
            );
            this.player1.triggerAbility("Maiden's Bane");
            expect(this.player1).toBeAbleToSelect(card);
            for (const other of [this.maidensBane, this.handmaiden, this.rangingParty])
                expect(this.player1).not.toBeAbleToSelect(other);
            this.player1.clickCard(card);
            expect(card.kneeled).toBe(false);
            expect(this.maidensBane.kneeled).toBe(attacker === 'House Maester');
            expect(this.handmaiden.kneeled).toBe(true);
            expect(this.rangingParty.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    }

    it('does not react to an opposed challenge win', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["Maiden's Bane", 'Ranging Party'] },
            player2: { inPlay: ['House Maester'] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.rangingParty);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.houseMaester);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).not.toAllowAbilityTrigger("Maiden's Bane");
        expect(this.maidensBane.kneeled).toBe(false);
        expect(this.rangingParty.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
