describe('a facedown card in play', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: "A Mummer's Farce",
                inPlay: ['Jinglebell (HMW)'],
                drawDeck: ['Hoster Tully']
            }
        });
        this.facedownCard = this.player1.findCardByName('Hoster Tully', 'draw deck');
        this.unopposedChallenge(this.player1, 'Intrigue', this.jinglebell);
        this.completeChallengesPhase();
    });

    it('has none of its printed title, traits or faction, only what it was granted', function () {
        expect(this.facedownCard.parent).toBe(this.jinglebell);
        expect(this.facedownCard.facedown).toBe(true);

        expect(this.facedownCard.name).toBe('');
        expect(this.facedownCard.hasTrait('Lord')).toBe(false);
        expect(this.facedownCard.hasTrait('House Tully')).toBe(false);
        expect(this.facedownCard.hasTrait('Weapon')).toBe(true);
        expect(this.facedownCard.getTraits()).toEqual(['weapon']);
        expect(this.facedownCard.isFaction('stark')).toBe(false);
        expect(this.facedownCard.getType()).toBe('attachment');
    });

    it('keeps its identity for its own play rules', function () {
        expect(this.facedownCard.isUnique()).toBe(true);
        expect(this.facedownCard.isCopyOf(this.facedownCard.createSnapshot())).toBe(true);
    });

    describe('once it is marshaled', function () {
        beforeEach(function () {
            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
            this.player1.clickCard(this.facedownCard);
        });

        it('has its printed attributes again', function () {
            expect(this.facedownCard.location).toBe('play area');
            expect(this.facedownCard.facedown).toBe(false);
            expect(this.facedownCard.name).toBe('Hoster Tully');
            expect(this.facedownCard.hasTrait('Lord')).toBe(true);
            expect(this.facedownCard.hasTrait('Weapon')).toBe(false);
            expect(this.facedownCard.isFaction('stark')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
