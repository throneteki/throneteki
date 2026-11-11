describe('Waking the Dragon', function () {
    function setup(context) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Doreah', kneeling: true },
                    'Drogon (Core)',
                    { card: 'Handmaiden', kneeling: true },
                    { card: 'Sansa Stark (WotN)', kneeling: true }
                ],
                hand: ['Waking the Dragon']
            },
            player2: { inPlay: [{ card: 'Daenerys Targaryen (Core)', kneeling: true }] }
        });
    }

    it('stands your unique Targaryen character and returns only that character at phase end', function () {
        setup(this);
        this.player1.clickCard(this.wakingTheDragon);
        expect(this.player1).toBeAbleToSelect(this.doreah);
        expect(this.player1).toBeAbleToSelect(this.drogon);
        for (const card of [this.handmaiden, this.sansaStark, this.daenerysTargaryen]) {
            expect(this.player1).not.toBeAbleToSelect(card);
        }
        this.player1.clickCard(this.doreah);
        expect(this.doreah.kneeled).toBe(false);
        expect(this.handmaiden.kneeled).toBe(true);
        expect(this.sansaStark.kneeled).toBe(true);
        expect(this.daenerysTargaryen.kneeled).toBe(true);
        expect(this.drogon.kneeled).toBe(false);
        expect(this.doreah.location).toBe('play area');
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        expect(this.doreah.location).toBe('hand');
        for (const card of [
            this.drogon,
            this.handmaiden,
            this.sansaStark,
            this.daenerysTargaryen
        ]) {
            expect(card.location).toBe('play area');
        }
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not create a delayed return if the event is cancelled', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Doreah', kneeling: true }],
                hand: ['Waking the Dragon']
            },
            player2: { hand: ["The Hand's Judgment"] }
        });
        this.player1.clickCard(this.wakingTheDragon);
        this.player1.clickCard(this.doreah);
        this.player2.triggerAbility("The Hand's Judgment");
        expect(this.doreah.kneeled).toBe(true);
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        expect(this.doreah.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('can target a standing character because the delayed return still changes the game state', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Doreah'], hand: ['Waking the Dragon'] }
        });
        this.player1.clickCard(this.wakingTheDragon);
        this.player1.clickCard(this.doreah);
        expect(this.doreah.kneeled).toBe(false);
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        expect(this.doreah.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    it('allows a duplicate to save the character from the delayed return', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Doreah', kneeling: true, dupes: 1 }],
                hand: ['Waking the Dragon']
            }
        });
        this.player1.clickCard(this.wakingTheDragon);
        this.player1.clickCard(this.doreah);
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        expect(this.doreah.location).toBe('play area');
        expect(this.doreah.dupes.length).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not return the character if it is killed before the end of the phase', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Doreah', kneeling: true }],
                hand: ['Waking the Dragon']
            },
            player2: { inPlay: ['Ranging Party'] }
        });
        this.player1.clickCard(this.wakingTheDragon);
        this.player1.clickCard(this.doreah);
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.rangingParty);
        this.player1.clickCard(this.doreah);
        expect(this.doreah.location).toBe('dead pile');
        this.player1.togglePromptedActionWindow('dominance', true);
        this.player2.clickPrompt('Done');
        expect(this.doreah.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
