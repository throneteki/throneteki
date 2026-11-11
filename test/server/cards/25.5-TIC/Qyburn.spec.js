describe('Qyburn (TIC)', function () {
    it('takes an eligible opposing dead character and removes it at the end of the phase', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Qyburn (TIC)'], deadPile: ['Viserys Targaryen (Core)'], gold: 3 },
            player2: {
                deadPile: ['Sansa Stark (WotN)', 'Ranging Party'],
                discard: ['Hedge Knight'],
                inPlay: ['House Maester']
            }
        });
        this.player1.clickCard(this.qyburn);
        expect(this.player1).toAllowAbilityTrigger('Qyburn');
        this.player1.triggerAbility('Qyburn');
        expect(this.player1).toBeAbleToSelect(this.sansaStark);
        for (const card of [
            this.viserysTargaryen,
            this.rangingParty,
            this.hedgeKnight,
            this.houseMaester,
            this.qyburn
        ]) {
            expect(this.player1).not.toBeAbleToSelect(card);
        }
        this.player1.clickCard(this.sansaStark);
        expect(this.sansaStark.location).toBe('play area');
        expect(this.sansaStark.controller).toBe(this.player1Object);
        this.completeMarshalPhase();
        expect(this.sansaStark.location).toBe('out of game');
        expect(this.viserysTargaryen.location).toBe('dead pile');
        expect(this.rangingParty.location).toBe('dead pile');
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.houseMaester.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot save the delayed removal with a duplicate', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Qyburn (TIC)'], gold: 3 },
            player2: {
                deadPile: ['Sansa Stark (WotN)'],
                hand: ['Sansa Stark (WotN)', 'Ward (TS)'],
                gold: 4
            }
        });
        const dead = this.player2.findCardByName('Sansa Stark', 'dead pile');
        const dupe = this.player2.findCardByName('Sansa Stark', 'hand');
        this.player1.clickCard(this.qyburn);
        this.player1.triggerAbility('Qyburn');
        this.player1.clickCard(dead);
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.ward);
        this.player2.clickCard(dead);
        expect(dead.controller).toBe(this.player2Object);
        this.player2.clickCard(dupe);
        expect(dead.dupes).toContain(dupe);
        this.player2.clickPrompt('Done');
        expect(dead.location).toBe('out of game');
        this.player2.clickCard(this.ward);
        this.player2.clickCard(dupe);
        this.player2.clickPrompt('Done');
        expect(dupe.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not trigger when marshaled from hand', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Qyburn (TIC)'], gold: 3 },
            player2: { deadPile: ['Sansa Stark (WotN)'] }
        });
        this.player1.clickCard(this.qyburn);
        this.player1.clickPrompt('Marshal');
        expect(this.player1).not.toAllowAbilityTrigger('Qyburn');
        expect(this.sansaStark.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
