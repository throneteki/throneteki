describe("King Robert's Warhammer", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'House Maester', attachments: ["King Robert's Warhammer"] },
                    'Ranging Party',
                    { card: 'Handmaiden', kneeling: true }
                ]
            },
            player2: { inPlay: ['Bastard in Hiding', 'Lannisport Merchant', 'Winterfell Steward'] }
        });
    });

    it('adds one STR and kneels exactly that total STR before sacrificing itself', function () {
        expect(this.houseMaester.getStrength()).toBe(3);
        expect(this.rangingParty.getStrength()).toBe(5);
        this.unopposedChallenge(this.player1, 'Power', this.houseMaester);
        expect(this.player1).toAllowAbilityTrigger("King Robert's Warhammer");
        this.player1.triggerAbility("King Robert's Warhammer");
        for (const card of [
            this.bastardInHiding,
            this.lannisportMerchant,
            this.winterfellSteward
        ]) {
            expect(this.player1).toBeAbleToSelect(card);
        }
        for (const card of [this.houseMaester, this.rangingParty, this.handmaiden]) {
            expect(this.player1).not.toBeAbleToSelect(card);
        }
        this.player1.clickCard(this.bastardInHiding);
        this.player1.clickCard(this.lannisportMerchant);
        this.player1.clickPrompt('Done');
        expect(this.bastardInHiding.kneeled).toBe(true);
        expect(this.lannisportMerchant.kneeled).toBe(true);
        expect(this.winterfellSteward.kneeled).toBe(false);
        expect(this.rangingParty.kneeled).toBe(false);
        expect(this.kingRobertsWarhammer.location).toBe('discard pile');
        expect(this.houseMaester.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('can kneel less than the full STR allowance', function () {
        this.unopposedChallenge(this.player1, 'Power', this.houseMaester);
        this.player1.triggerAbility("King Robert's Warhammer");
        this.player1.clickCard(this.lannisportMerchant);
        this.player1.clickPrompt('Done');
        expect(this.lannisportMerchant.kneeled).toBe(true);
        expect(this.bastardInHiding.kneeled).toBe(false);
        expect(this.kingRobertsWarhammer.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('is not offered for a challenge without its attached character attacking', function () {
        this.unopposedChallenge(this.player1, 'Military', this.rangingParty);
        expect(this.player1).not.toAllowAbilityTrigger("King Robert's Warhammer");
        this.player2.clickCard(this.winterfellSteward);
        expect(this.kingRobertsWarhammer.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not sacrifice itself when you cancel without choosing a character to kneel', function () {
        this.unopposedChallenge(this.player1, 'Power', this.houseMaester);
        this.player1.triggerAbility("King Robert's Warhammer");
        this.player1.clickPrompt('Done');
        expect(this.kingRobertsWarhammer.location).toBe('play area');
        expect(this.bastardInHiding.kneeled).toBe(false);
        expect(this.lannisportMerchant.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
