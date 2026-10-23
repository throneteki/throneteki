describe('Green Dreams', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Hedge Knight', attachments: ['Green Dreams'] }],
                drawDeck: ['Castle Guard', 'Winterfell Steward']
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility('Green Dreams');
    });

    it('looks at the top card of your deck after the attached character kneels, and may put it on the bottom', function () {
        this.player1.clickPrompt('Yes');
        expect(this.player1Object.drawDeck.at(-1)).toBe(this.castleGuard);
    });

    it('leaves it on top if you decline', function () {
        this.player1.clickPrompt('No');
        expect(this.player1Object.drawDeck[0]).toBe(this.castleGuard);
    });
});
