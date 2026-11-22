describe("The Faith's Decree", function () {
    it('names a card so opponents cannot trigger abilities of cards with that name this phase', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['House Tully Septon'], hand: ["The Faith's Decree"] },
            player2: {
                actionWindows: { challengeBegin: true },
                inPlay: ['Veteran Builder', { card: 'The Roseroad', kneeling: true }]
            }
        });
        this.player1.clickCard(this.theFaithsDecree);
        this.player1.nameCard('Veteran Builder');
        expect(this.player2).toHavePrompt('Initiate an action');
        expect(this.player2.actionUnavailableReason(this.veteranBuilder)).toBe('cannotTrigger');
    });

    it('can only be played if you control a The Seven character or location', function () {
        this.setupTest({ phase: 'challenge', player1: { hand: ["The Faith's Decree"] } });
        expect(this.player1.actionUnavailableReason(this.theFaithsDecree)).toBe('condition');
    });
});
