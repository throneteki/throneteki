describe('Dorne (R)', function () {
    function lose(context, type = 'Power') {
        context.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Dorne (R)', 'House Maester'],
                hand: ['The Kingsroad'],
                drawDeck: ['Hedge Knight', 'Castle Guard', 'Tumblestone Knight']
            },
            player2: { inPlay: ['Arianne Martell (Core)'], drawDeck: ['Winterfell Steward'] }
        });
        context.player1.clickPrompt(type);
        context.player1.clickCard(context.houseMaester);
        context.player1.clickPrompt('Done');
        context.skipActionWindow();
        context.player2.clickCard(context.arianneMartell);
        context.player2.clickPrompt('Done');
        context.skipActionWindow();
    }

    for (const chosen of ['Hedge Knight', 'Castle Guard']) {
        it(`adds ${chosen} from the top two and puts only the other card on the bottom`, function () {
            lose(this);
            expect(this.player1Object.getReserve()).toBe(7);
            expect(this.player2Object.getReserve()).toBe(6);
            this.player1.triggerAbility('Dorne');
            expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).toBeAbleToSelect(this.castleGuard);
            for (const card of [
                this.tumblestoneKnight,
                this.winterfellSteward,
                this.theKingsroad,
                this.houseMaester,
                this.arianneMartell
            ])
                expect(this.player1).not.toBeAbleToSelect(card);
            const selected = chosen === 'Hedge Knight' ? this.hedgeKnight : this.castleGuard;
            const bottom = chosen === 'Hedge Knight' ? this.castleGuard : this.hedgeKnight;
            this.player1.clickCard(selected);
            expect(selected.location).toBe('hand');
            expect(this.player1Object.drawDeck.at(-1)).toBe(bottom);
            expect(this.player1Object.drawDeck[0]).toBe(this.tumblestoneKnight);
            expect(this.winterfellSteward.location).toBe('draw deck');
            expect(this.player1).isReadyToTakeAction();
        });
    }

    it('applies the printed restriction on intrigue losses', function () {
        lose(this, 'Intrigue');
        expect(this.player1).not.toAllowAbilityTrigger('Dorne');
        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not react after winning a challenge', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Dorne (R)', 'House Maester'],
                drawDeck: ['Hedge Knight', 'Castle Guard']
            }
        });
        this.unopposedChallenge(this.player1, 'Power', this.houseMaester);
        expect(this.player1).not.toAllowAbilityTrigger('Dorne');
        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });

    for (const refill of [false, true]) {
        it(
            refill
                ? 'can add the sole card remaining in the deck'
                : 'does not react with an empty deck',
            function () {
                this.setupTest({
                    phase: 'challenge',
                    player1: {
                        inPlay: [
                            'Dorne (R)',
                            'House Maester',
                            ...(refill ? ['Meereenese Market'] : [])
                        ],
                        shadows: ['A Mission in Essos (MoD)'],
                        gold: 2
                    },
                    player2: { inPlay: ['Arianne Martell (Core)'] }
                });
                this.player1.clickCard(this.aMissionInEssos);
                expect(this.player1Object.drawDeck.length).toBe(0);
                if (refill) {
                    this.player1.clickCard(this.meereeneseMarket);
                    this.player1.clickCard(this.aMissionInEssos);
                    expect(this.player1Object.drawDeck.length).toBe(1);
                }
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.houseMaester);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickCard(this.arianneMartell);
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                if (refill) {
                    this.player1.triggerAbility('Dorne');
                    this.player1.clickCard(this.aMissionInEssos);
                    expect(this.aMissionInEssos.location).toBe('hand');
                } else {
                    expect(this.player1).not.toAllowAbilityTrigger('Dorne');
                }
                expect(this.player1).isReadyToTakeAction();
            }
        );
    }
});
