describe('Meereen (TMoW)', function () {
    describe('when used by one player', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Meereen (TMoW)', 'Veteran Builder'],
                    hand: ['Hedge Knight', 'Castle Guard']
                }
            });
            this.player1.clickMenu(this.meereen, 'Place hand facedown and draw 3');
        });

        it('places your hand facedown under Meereen and draws 3 cards', function () {
            expect(this.hedgeKnight.location).toBe('underneath');
            expect(this.castleGuard.location).toBe('underneath');
            expect(this.player1Object.hand.length).toBe(3);
        });

        it('at the end of the phase discards your hand and returns the cards under Meereen', function () {
            this.completeMarshalPhase();
            this.player1.clickPrompt('Done');
            expect(this.hedgeKnight.location).toBe('hand');
            expect(this.castleGuard.location).toBe('hand');
            expect(this.player1Object.discardPile.length).toBe(3);
        });

        it('discards every card placed under Meereen when used twice in a phase', function () {
            // Ruling: http://www.cardgamedb.com/forums/index.php?/topic/39868-ruling-meereen/
            this.player1.clickMenu(this.veteranBuilder, 'Stand a location');
            this.player1.clickCard(this.meereen);
            this.player1.clickMenu(this.meereen, 'Place hand facedown and draw 3');
            this.completeMarshalPhase();
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1Object.hand.length).toBe(0);
            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.castleGuard.location).toBe('discard pile');
            expect(this.player1Object.discardPile.length).toBe(9);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when Meereen leaves play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Meereen (TMoW)'],
                    hand: ['Hedge Knight', 'Castle Guard']
                },
                player2: { inPlay: ['Ser Gregor Clegane (TKP)'], hand: ['Put to the Torch'] }
            });
            this.player1.clickMenu(this.meereen, 'Place hand facedown and draw 3');
            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Military', this.serGregorClegane);
            this.player2.triggerAbility('Put to the Torch');
            this.player2.clickCard(this.meereen);
        });

        it('discards your hand and returns the cards under Meereen', function () {
            this.player1.clickPrompt('Done');
            expect(this.meereen.location).toBe('discard pile');
            expect(this.hedgeKnight.location).toBe('hand');
            expect(this.castleGuard.location).toBe('hand');
            expect(this.player1Object.hand.length).toBe(2);
        });
    });

    describe('when used by multiple players', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Meereen (TMoW)'],
                    hand: ['Hedge Knight', 'Castle Guard']
                },
                player2: {
                    inPlay: ['Dagmer Cleftjaw (TS)', 'Veteran Builder'],
                    hand: ['Winterfell Steward', 'The Roseroad']
                }
            });
            this.player1.clickMenu(this.meereen, 'Place hand facedown and draw 3');
            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Power', this.dagmerCleftjaw);
            this.player2.triggerAbility('Dagmer Cleftjaw');
            this.player2.clickCard(this.meereen);
            this.player2.clickMenu(this.veteranBuilder, 'Stand a location');
            this.player2.clickCard(this.meereen);
            this.player2.clickMenu(this.meereen, 'Place hand facedown and draw 3');
            this.player2.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
        });

        it('returns only the cards each player placed under Meereen to their hand', function () {
            // Ruling: http://www.cardgamedb.com/forums/index.php?/topic/39868-ruling-meereen/
            expect(this.hedgeKnight.location).toBe('hand');
            expect(this.castleGuard.location).toBe('hand');
            expect(this.winterfellSteward.location).toBe('hand');
            expect(this.theRoseroad.location).toBe('hand');
            expect(this.player1Object.hand.length).toBe(2);
            expect(this.player2Object.hand.length).toBe(2);
            expect(this.player1Object.discardPile.length).toBe(3);
            expect(this.player2Object.discardPile.length).toBe(4);
        });
    });
});
