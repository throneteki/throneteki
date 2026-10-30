describe('Ser Addam Marbrand', function () {
    for (const entering of ['Hedge Knight', 'Ranging Party']) {
        it(`gains one gold after your ${entering} enters play, only once that phase`, function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Ser Addam Marbrand (FH)'],
                    hand: [entering, 'Tumblestone Knight'],
                    gold: 8
                }
            });
            this.player1.clickCard(this.player1.findCardByName(entering, 'hand'));
            this.player1.triggerAbility('Ser Addam Marbrand');
            expect(this.serAddamMarbrand.gold).toBe(1);
            this.player1.clickCard(this.tumblestoneKnight);
            expect(this.player1).not.toAllowAbilityTrigger('Ser Addam Marbrand');
            expect(this.serAddamMarbrand.gold).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    }

    it('does not gain gold for a character without Army or Knight', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Ser Addam Marbrand (FH)'], hand: ['House Maester'], gold: 2 }
        });
        this.player1.clickCard(this.houseMaester);
        expect(this.player1).not.toAllowAbilityTrigger('Ser Addam Marbrand');
        expect(this.serAddamMarbrand.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('spends one gold to retrieve a character twice per round, then cannot retrieve a third', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Ser Addam Marbrand (FH)', gold: 3 },
                    'Old Forest Hunter',
                    'Old Forest Hunter',
                    'Old Forest Hunter'
                ],
                hand: ['Handmaiden'],
                gold: 0
            }
        });
        const hunters = this.player1Object.cardsInPlay.filter(
            (card) => card.name === 'Old Forest Hunter'
        );
        for (const hunter of hunters.slice(0, 2)) {
            this.player1.clickCard(hunter);
            this.player1.clickCard(this.handmaiden);
            expect(this.player1).toAllowAbilityTrigger('Ser Addam Marbrand');
            this.player1.triggerAbility('Ser Addam Marbrand');
            expect(this.handmaiden.location).toBe('hand');
        }
        expect(this.serAddamMarbrand.gold).toBe(1);
        this.player1.clickCard(hunters[2]);
        this.player1.clickCard(this.handmaiden);
        expect(this.player1).not.toAllowAbilityTrigger('Ser Addam Marbrand');
        expect(this.handmaiden.location).toBe('discard pile');
        expect(this.serAddamMarbrand.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot retrieve a discarded character without gold to pay', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ser Addam Marbrand (FH)', 'Old Forest Hunter'],
                hand: ['Handmaiden']
            }
        });
        this.player1.clickCard(this.oldForestHunter);
        this.player1.clickCard(this.handmaiden);
        expect(this.player1).not.toAllowAbilityTrigger('Ser Addam Marbrand');
        expect(this.handmaiden.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot retrieve a discarded non-character', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Ser Addam Marbrand (FH)', gold: 1 }, 'Old Forest Hunter'],
                hand: ['The Roseroad']
            }
        });
        this.player1.clickCard(this.oldForestHunter);
        this.player1.clickCard(this.theRoseroad);
        expect(this.player1).not.toAllowAbilityTrigger('Ser Addam Marbrand');
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.serAddamMarbrand.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
