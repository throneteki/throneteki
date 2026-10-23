describe('Shaggydog (MoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Robb Stark (Core)', attachments: ['Shaggydog (MoD)'] },
                    'Arya Stark (Core)'
                ],
                gold: 1
            },
            player2: { inPlay: ['Hedge Knight', 'Castle Guard'] }
        });
    });

    it('has the losing opponent choose and kill a defending character after you win a challenge in which the attached character is attacking', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.robbStark);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('Shaggydog');
        expect(this.player2).not.toBeAbleToSelect(this.castleGuard);
        this.player2.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.castleGuard.location).toBe('play area');
    });

    it('pays 1 gold to attach Shaggydog to a different character', function () {
        this.player1.clickMenu(this.shaggydog, 'Attach Shaggydog to another character');
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
        this.player1.clickCard(this.aryaStark);
        expect(this.shaggydog.parent).toBe(this.aryaStark);
        expect(this.player1Object.gold).toBe(0);
    });
});
