describe('Queen of Meereen', function () {
    for (const amount of [1, 2]) {
        it(`discards ${amount} cards to reduce only the next marshaled card by twice that number`, function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: [{ card: 'Sansa Stark (WotN)', attachments: ['Queen of Meereen'] }],
                    hand: ['The Roseroad', 'Hedge Knight', 'Ranging Party', 'House Maester'],
                    gold: 4
                },
                player2: { inPlay: ['Arianne Martell (Core)'], hand: ['Winterfell Steward'] }
            });
            expect(this.sansaStark.hasTrait('Queen')).toBe(true);
            expect(this.arianneMartell.hasTrait('Queen')).toBe(false);
            this.player1.clickCard(this.queenOfMeereen);
            for (const card of [
                this.theRoseroad,
                this.hedgeKnight,
                this.rangingParty,
                this.houseMaester
            ]) {
                expect(this.player1).toBeAbleToSelect(card);
            }
            for (const card of [
                this.sansaStark,
                this.queenOfMeereen,
                this.arianneMartell,
                this.winterfellSteward
            ]) {
                expect(this.player1).not.toBeAbleToSelect(card);
            }
            this.player1.clickCard(this.theRoseroad);
            if (amount === 2) this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');
            if (amount === 2) {
                this.player1.clickCard(this.theRoseroad);
                this.player1.clickCard(this.hedgeKnight);
                this.player1.clickPrompt('Done');
            }
            expect(this.theRoseroad.location).toBe('discard pile');
            expect(this.hedgeKnight.location).toBe(amount === 2 ? 'discard pile' : 'hand');
            this.player1.clickCard(this.rangingParty);
            expect(this.rangingParty.location).toBe('play area');
            expect(this.player1Object.gold).toBe(amount * 2);
            this.player1.clickCard(this.houseMaester);
            expect(this.houseMaester.location).toBe('play area');
            expect(this.player1Object.gold).toBe(amount * 2 - 2);
            expect(this.winterfellSteward.location).toBe('hand');
            expect(this.player1.actionUnavailableReason(this.queenOfMeereen)).toBe(
                amount === 2 ? 'condition' : 'cost'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    }

    it('expires an unused reduction at the end of the phase', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Sansa Stark (WotN)', attachments: ['Queen of Meereen'] }],
                hand: ['The Roseroad'],
                shadows: ['Ser Jorah Mormont (LMHR)'],
                gold: 4
            }
        });
        this.player1.clickCard(this.queenOfMeereen);
        this.player1.clickCard(this.theRoseroad);
        this.player1.clickPrompt('Done');
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.serJorahMormont);
        expect(this.player1Object.gold).toBe(0);
        expect(this.serJorahMormont.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });

    it('cannot use the action without a card in hand to discard', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: [{ card: 'Sansa Stark (WotN)', attachments: ['Queen of Meereen'] }] }
        });
        expect(this.player1.actionUnavailableReason(this.queenOfMeereen)).toBe('condition');
        expect(this.player1).isReadyToTakeAction();
    });

    it('reduces the next ambush cost, then charges the normal cost for a second ambush', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Sansa Stark (WotN)', attachments: ['Queen of Meereen'] }],
                hand: ['The Roseroad', 'Burned Men', 'Burned Men'],
                gold: 2
            }
        });
        const men = this.player1Object.hand.filter((card) => card.name === 'Burned Men');
        this.player1.clickCard(this.queenOfMeereen);
        this.player1.clickCard(this.theRoseroad);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(men[0]);
        expect(men[0].location).toBe('play area');
        expect(this.player1Object.gold).toBe(2);
        this.player1.clickCard(men[1]);
        expect(men[1].location).toBe('play area');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('reduces the next cost to bring a card out of shadows', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Sansa Stark (WotN)', attachments: ['Queen of Meereen'] }],
                hand: ['The Roseroad'],
                shadows: ['Ser Jorah Mormont (LMHR)'],
                gold: 4
            }
        });
        this.player1.clickCard(this.queenOfMeereen);
        this.player1.clickCard(this.theRoseroad);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.serJorahMormont);
        expect(this.serJorahMormont.location).toBe('play area');
        expect(this.player1Object.gold).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Queen of Meereen when a duplicate is marshaled', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    { card: 'Sansa Stark (WotN)', attachments: ['Queen of Meereen'] },
                    'Khal Drogo (Core)'
                ],
                hand: ['Khal Drogo (Core)', 'The Roseroad', 'Hedge Knight'],
                gold: 2
            }
        });
        this.dupe = this.player1.findCardByName('Khal Drogo (Core)', 'hand');
        this.player1.clickCard(this.queenOfMeereen);
        this.player1.clickCard(this.theRoseroad);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.dupe);
    });

    it('uses up the reduction, as a duplicate is the next card you marshal', function () {
        expect(this.khalDrogo.dupes).toContain(this.dupe);

        this.player1.clickCard(this.hedgeKnight);

        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
