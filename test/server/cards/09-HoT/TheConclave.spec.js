describe('The Conclave', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'The Conclave',
                // The agenda removes seven random cards before setupTest arranges the board.
                // Eight copies leave at least one of each fixture available for that setup.
                deck: Array.from({ length: 7 }, () => [
                    'Castle Guard',
                    'Hedge Knight',
                    'The Roseroad'
                ]).flat(),
                inPlay: ['House Maester', 'Castle Guard'],
                drawDeck: ['Hedge Knight'],
                hand: ['The Roseroad']
            },
            player2: { inPlay: ['Ranging Party'] }
        });
        this.underneath = this.theConclave.underneath.slice();
    });

    it('places seven cards facedown under the agenda before setup and switches the chosen card with the top of the deck', function () {
        expect(this.underneath).toHaveLength(7);
        for (const card of this.underneath) {
            expect(card.location).toBe('underneath');
            expect(card.facedown).toBe(true);
        }
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.houseMaester);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).toAllowAbilityTrigger(this.theConclave);
        this.player1.triggerAbility(this.theConclave);
        for (const card of this.underneath) {
            expect(this.player1).toBeAbleToSelect(card);
        }
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
        expect(this.player1).not.toBeAbleToSelect(this.theRoseroad);
        expect(this.player1).not.toBeAbleToSelect(this.houseMaester);
        expect(this.player1).not.toBeAbleToSelect(this.rangingParty);
        this.player1.clickCard(this.underneath[0]);
        expect(this.player1Object.drawDeck[0]).toBe(this.underneath[0]);
        expect(this.underneath[0].facedown).toBe(false);
        expect(this.hedgeKnight.location).toBe('underneath');
        expect(this.hedgeKnight.facedown).toBe(true);
        expect(this.theConclave.underneath).toHaveLength(7);
        expect(this.theConclave.underneath).not.toContain(this.underneath[0]);
        expect(this.theRoseroad.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not trigger after winning without a participating Maester', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.rangingParty);
        expect(this.player1).not.toAllowAbilityTrigger(this.theConclave);
        expect(this.player1Object.drawDeck[0]).toBe(this.hedgeKnight);
        expect(this.theConclave.underneath).toEqual(this.underneath);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not trigger after a participating Maester loses', function () {
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.houseMaester);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.rangingParty);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).not.toAllowAbilityTrigger(this.theConclave);
        expect(this.player1Object.drawDeck[0]).toBe(this.hedgeKnight);
        expect(this.theConclave.underneath).toEqual(this.underneath);
        expect(this.player1).isReadyToTakeAction();
    });
});
