describe("King's Landing (SoKL)", function () {
    describe('marshaling from the discard pile', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ["King's Landing (SoKL)"],
                    discard: ['The Roseroad', 'Winterfell Crypt', 'Skagos (IDP)', 'Hedge Knight'],
                    gold: 10
                },
                player2: { discard: ['Castle Black (Core)'] }
            });
        });

        it('allows one of your locations and prevents a second location or other card', function () {
            expect(this.player1Object.isCardInPlayableLocation(this.castleBlack, 'marshal')).toBe(
                false
            );
            expect(this.player1Object.isCardInPlayableLocation(this.hedgeKnight, 'marshal')).toBe(
                false
            );
            this.player1.clickCard(this.winterfellCrypt);
            expect(this.winterfellCrypt.location).toBe('play area');
            expect(this.player1Object.gold).toBe(9);
            expect(this.player1Object.isCardInPlayableLocation(this.theRoseroad, 'marshal')).toBe(
                false
            );
            expect(this.theRoseroad.location).toBe('discard pile');
            expect(this.castleBlack.location).toBe('discard pile');
            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });

        it('allows marshaling a shadows location faceup, without marshaling it into shadows', function () {
            this.player1.clickCard(this.skagos);
            expect(this.player1).not.toHavePromptButton('Marshal into shadows');
            expect(this.skagos.location).toBe('play area');
            expect(this.player1Object.gold).toBe(8);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    it('kneels and discards a location from hand to draw one card during challenges', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ["King's Landing (SoKL)"],
                hand: ['The Roseroad', 'Hedge Knight'],
                drawDeck: ['House Maester']
            }
        });
        this.player1.clickCard(this.kingsLanding);
        expect(this.player1).toBeAbleToSelect(this.theRoseroad);
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
        this.player1.clickCard(this.theRoseroad);
        expect(this.kingsLanding.kneeled).toBe(true);
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.houseMaester.location).toBe('hand');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot draw without a location in hand to discard', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["King's Landing (SoKL)"], hand: ['Hedge Knight'] }
        });
        expect(this.player1.actionUnavailableReason(this.kingsLanding)).toBe('cost');
        expect(this.kingsLanding.kneeled).toBe(false);
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
