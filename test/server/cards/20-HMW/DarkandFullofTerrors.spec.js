describe('Dark and Full of Terrors', function () {
    it('places a kneeling character with STR at most three in shadows with its printed cost as shadow cost', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Dragonstone Convert', { card: 'Handmaiden', kneeling: true }],
                hand: ['Dark and Full of Terrors'],
                gold: 2
            },
            player2: {
                inPlay: [
                    { card: 'House Maester', kneeling: true },
                    { card: 'Sansa Stark (WotN)', kneeling: true },
                    'Hedge Knight',
                    'The Roseroad'
                ],
                gold: 2
            }
        });
        this.player1.clickCard(this.darkAndFullOfTerrors);
        expect(this.player1).toBeAbleToSelect(this.houseMaester);
        expect(this.player1).toBeAbleToSelect(this.handmaiden);
        for (const card of [
            this.dragonstoneConvert,
            this.sansaStark,
            this.hedgeKnight,
            this.theRoseroad
        ]) {
            expect(this.player1).not.toBeAbleToSelect(card);
        }
        this.player1.clickCard(this.houseMaester);
        expect(this.houseMaester.location).toBe('shadows');
        expect(this.houseMaester.tokens.shadow).toBe(1);
        expect(this.houseMaester.getShadowCost()).toBe(2);
        expect(this.handmaiden.location).toBe('play area');
        expect(this.sansaStark.location).toBe('play area');
        expect(this.hedgeKnight.location).toBe('play area');
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.houseMaester);
        expect(this.houseMaester.location).toBe('play area');
        expect(this.player2Object.gold).toBe(0);
        expect(this.houseMaester.isShadow()).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });

    it('does not grant a shadow keyword or token if a duplicate saves the character', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Dragonstone Convert'],
                hand: ['Dark and Full of Terrors'],
                gold: 2
            },
            player2: { inPlay: [{ card: 'Doreah', kneeling: true, dupes: 1 }] }
        });
        this.player1.clickCard(this.darkAndFullOfTerrors);
        this.player1.clickCard(this.doreah);
        expect(this.doreah.location).toBe('play area');
        expect(this.doreah.dupes.length).toBe(0);
        expect(this.doreah.isShadow()).toBe(false);
        expect(this.doreah.tokens.shadow).toBeUndefined();
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot be played without a Rhllor character', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Dark and Full of Terrors'], gold: 2 },
            player2: { inPlay: [{ card: 'House Maester', kneeling: true }] }
        });
        expect(this.player1.actionUnavailableReason(this.darkAndFullOfTerrors)).toBe('condition');
        expect(this.player1).isReadyToTakeAction();
    });
});
