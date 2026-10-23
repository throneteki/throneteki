describe('Pay The Iron Price', function () {
    describe('putting an attachment into play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ["Black Wind's Crew"], hand: ['Pay The Iron Price'] },
                player2: {
                    inPlay: ['Iron Islands Fishmonger'],
                    discard: ['Little Bird (Core)', 'Fishing Net', 'Milk of the Poppy', 'Ward (TS)']
                }
            });
            this.player1.clickCard(this.payTheIronPrice);
        });

        it('controls a normal attachment and attaches it to your own character', function () {
            this.player1.clickCard(this.littleBird);
            this.player1.clickCard(this.blackWindsCrew);
            expect(this.littleBird.controller).toBe(this.player1Object);
            expect(this.blackWindsCrew.attachments).toContain(this.littleBird);
            expect(this.player2Object.discardPile).not.toContain(this.littleBird);
        });

        it("controls an opponent-only attachment and attaches it to an opponent's character", function () {
            this.player1.clickCard(this.fishingNet);
            this.player1.clickCard(this.ironIslandsFishmonger);
            expect(this.fishingNet.controller).toBe(this.player1Object);
            expect(this.ironIslandsFishmonger.attachments).toContain(this.fishingNet);
        });

        it("places the attachment back in its owner's discard pile when it leaves play", function () {
            this.player1.clickCard(this.milkOfThePoppy);
            this.player1.clickCard(this.ironIslandsFishmonger);
            expect(this.ironIslandsFishmonger.isAnyBlank()).toBe(true);
            this.unopposedChallenge(this.player1, 'Military', this.blackWindsCrew);
            this.player1.clickPrompt('Pass');
            this.player2.clickCard(this.ironIslandsFishmonger);
            expect(this.milkOfThePoppy.controller).toBe(this.player2Object);
            expect(this.milkOfThePoppy.location).toBe('discard pile');
        });

        it('takes control of the character with an attachment that takes control', function () {
            this.player1.clickCard(this.ward);
            this.player1.clickCard(this.ironIslandsFishmonger);
            expect(this.ironIslandsFishmonger.attachments).toContain(this.ward);
            expect(this.ironIslandsFishmonger.controller).toBe(this.player1Object);
        });
    });

    it('pays 1 gold to return itself to your hand after you win an unopposed challenge', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'], discard: ['Pay The Iron Price'] }
        });
        this.startingGold = this.player1Object.gold;
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Pay The Iron Price');
        expect(this.payTheIronPrice.location).toBe('hand');
        expect(this.player1Object.gold).toBe(this.startingGold - 1);
    });
});
