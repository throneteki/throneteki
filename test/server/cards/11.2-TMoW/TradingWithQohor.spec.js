describe('Trading With Qohor', function () {
    describe('while you control no attachments', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { agenda: 'Trading With Qohor' }
            });
        });

        it("increases the gold value on each opponent's revealed plot by 1", function () {
            expect(this.player2Object.getIncome()).toBe(6);
            expect(this.player1Object.getIncome()).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('after claim is applied for a challenge you won', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    agenda: 'Trading With Qohor',
                    inPlay: [{ card: 'Hedge Knight', attachments: ['Little Bird (Core)'] }],
                    drawDeck: [
                        'Noble Lineage',
                        "Syrio's Training",
                        'Valyrian Steel Dagger (LoCR)',
                        'Little Bird (Core)'
                    ]
                }
            });

            [this.attachedBird, this.deckBird] = [
                this.player1.findCardByName('Little Bird', 'play area'),
                this.player1.findCardByName('Little Bird', 'draw deck')
            ];
            this.unopposedChallenge(this.player1, 'Intrigue', this.hedgeKnight);
        });

        it('does not increase opponents’ gold while you control an attachment', function () {
            expect(this.player2Object.getIncome()).toBe(5);

            this.player1.clickPrompt('Pass');

            expect(this.player1).isReadyToTakeAction();
        });

        describe('and it is triggered', function () {
            beforeEach(function () {
                this.player1.triggerAbility(this.tradingWithQohor);
                this.player1.clickCard(this.attachedBird);
            });

            it('can find a different attachment with equal or lower printed cost', function () {
                expect(this.attachedBird.location).toBe('discard pile');
                expect(this.player1).toBeAbleToSelect(this.nobleLineage);
                expect(this.player1).toBeAbleToSelect(this.syriosTraining);
                expect(this.player1).not.toBeAbleToSelect(this.valyrianSteelDagger);
                expect(this.player1).not.toBeAbleToSelect(this.deckBird);

                this.player1.clickCard(this.syriosTraining);
                this.player1.clickCard(this.hedgeKnight);

                expect(this.player1).isReadyToTakeAction();
            });

            it('puts it into play', function () {
                this.player1.clickCard(this.syriosTraining);
                this.player1.clickCard(this.hedgeKnight);

                expect(this.hedgeKnight.attachments).toContain(this.syriosTraining);
                expect(this.deckBird.location).toBe('draw deck');
                expect(this.game.getPlainTextLog()).toContain(
                    'player1 uses Trading With Qohor to search their deck for another attachment with printed cost 1 or lower'
                );
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});

describe('Trading With Qohor and reactions to claim kills', function () {
    it('shares a window with reactions to the characters killed for claim', function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player1',
            player1: {
                agenda: 'Trading With Qohor',
                inPlay: [{ card: 'Hedge Knight', attachments: ['Little Bird (Core)'] }],
                drawDeck: ['Milk of the Poppy']
            },
            player2: {
                inPlay: ['Margaery Tyrell (AMAF)', 'Eddard Stark (Core)'],
                drawDeck: ['Robert Baratheon (Core)']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player2.clickCard(this.eddardStark);

        expect(this.player1).toHavePrompt('Any reactions to Eddard Stark being killed?');

        this.player1.triggerAbility('Trading With Qohor');
        this.player1.clickCard(this.littleBird);
        this.player1.clickCard(this.milkOfThePoppy);
        this.player1.clickCard(this.margaeryTyrell);

        expect(this.margaeryTyrell.attachments).toContain(this.milkOfThePoppy);
        expect(this.player2).not.toAllowAbilityTrigger('Margaery Tyrell');
        expect(this.robertBaratheon.location).toBe('draw deck');
    });
});
