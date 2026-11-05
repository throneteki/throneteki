describe('Podrick Payne', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Podrick Payne (TC)'], inPlay: ['Tyrion Lannister (Core)'], gold: 4 },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.tyrionLannister);
        this.player1.triggerAbility('Podrick Payne');
    });

    it('pays 2 gold and comes into play to save a character killed for military claim, then may pay 2 gold to kill an attacker if it saved Tyrion', function () {
        expect(this.podrickPayne.location).toBe('play area');
        expect(this.tyrionLannister.location).toBe('play area');
        this.player1.clickPrompt('Yes');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.player1Object.gold).toBe(0);
    });
});

describe('Podrick Payne against a kill that is not for claim', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Podrick Payne (TC)'], inPlay: ['Tyrion Lannister (Core)'], gold: 4 },
            player2: { hand: ['Podrick Payne (TC)'], inPlay: ['Hedge Knight'], gold: 2 }
        });
        this.podrick1 = this.player1.findCardByName('Podrick Payne', 'hand');
        this.podrick2 = this.player2.findCardByName('Podrick Payne', 'hand');
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.tyrionLannister);
        this.player1.triggerAbility(this.podrick1);
        this.player1.clickPrompt('Yes');
        this.player1.clickCard(this.hedgeKnight);
    });

    it("cannot save the attacker killed by the other Podrick's ability", function () {
        expect(this.player2).not.toAllowAbilityTrigger(this.podrick2);
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.podrick2.location).toBe('hand');
        expect(this.player2Object.gold).toBe(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
