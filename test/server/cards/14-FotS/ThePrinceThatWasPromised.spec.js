describe('The Prince that was Promised', function () {
    function winPower(context, attacker) {
        context.player1.clickPrompt('Power');
        context.player1.clickCard(attacker);
        context.player1.clickPrompt('Done');
        context.skipActionWindow();
        context.player2.clickPrompt('Done');
        context.skipActionWindow();
    }

    it('names only a unique character, allows that character renown, and stands it while drawing a card at exactly five STR', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'The Prince that was Promised',
                inPlay: ['Eddard Stark (Core)', 'Randyll Tarly (Core)'],
                drawDeck: ['Hedge Knight']
            },
            beforeMulligan() {
                this.player1.nameCard('House Maester');
                expect(this.player1).toHavePrompt('Name a unique character');
                this.player1.nameCard('Winterfell');
                expect(this.player1).toHavePrompt('Name a unique character');
                this.player1.nameCard('eddard stark');
            }
        });
        winPower(this, this.eddardStark);
        expect(this.player1).toAllowAbilityTrigger(this.thePrinceThatWasPromised);
        this.player1.triggerAbility(this.thePrinceThatWasPromised);
        this.player1.clickPrompt('Stand and draw');
        expect(this.eddardStark.kneeled).toBe(false);
        expect(this.eddardStark.power).toBe(1);
        expect(this.randyllTarly.power).toBe(0);
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('prevents other friendly characters gaining renown while allowing opponents to gain it', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'The Prince that was Promised',
                inPlay: ['Randyll Tarly (Core)'],
                factionKneeling: true
            },
            player2: { inPlay: ['Balon Greyjoy (Core)'] },
            beforeMulligan() {
                this.player1.nameCard('Eddard Stark');
            }
        });
        winPower(this, this.randyllTarly);
        expect(this.randyllTarly.power).toBe(0);
        expect(this.player1).not.toAllowAbilityTrigger(this.thePrinceThatWasPromised);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.balonGreyjoy);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.balonGreyjoy.power).toBe(1);
        expect(this.randyllTarly.power).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });

    for (const location of ['drawDeck', 'discard', 'deadPile']) {
        it(`searches the ${location} for the named character, reveals it and shuffles the deck`, function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    agenda: 'The Prince that was Promised',
                    inPlay: ['Ranging Party'],
                    [location]: ['Eddard Stark (Core)'],
                    drawDeckBottom: ['Hedge Knight'],
                    hand: ['Castle Guard']
                },
                player2: { deadPile: ['Eddard Stark (Core)'] },
                beforeMulligan() {
                    this.player1.nameCard('Eddard Stark');
                }
            });
            const named = this.player1.findCardByName('Eddard Stark');
            const opponent = this.player2.findCardByName('Eddard Stark');
            winPower(this, this.rangingParty);
            this.player1.triggerAbility(this.thePrinceThatWasPromised);
            this.player1.clickPrompt('Search');
            expect(this.player1).toBeAbleToSelect(named);
            expect(this.player1).not.toBeAbleToSelect(opponent);
            expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).not.toBeAbleToSelect(this.castleGuard);
            expect(this.player1).not.toBeAbleToSelect(this.rangingParty);
            this.player1.clickCard(named);
            expect(named.location).toBe('hand');
            expect(opponent.location).toBe('dead pile');
            expect(this.player1Object.faction.kneeled).toBe(true);
            expect(this.game.getPlainTextLog()).toContain('player1 reveals Eddard Stark');
            expect(this.game.getPlainTextLog()).toContain('player1 shuffles their deck');
            expect(this.player1).isReadyToTakeAction();
        });
    }

    for (const strength of [4, 6]) {
        it(`${strength === 4 ? 'does not trigger' : 'triggers'} after winning by ${strength} STR`, function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    agenda: 'The Prince that was Promised',
                    inPlay: [strength === 4 ? 'Sansa Stark (WotN)' : 'Randyll Tarly (JS)'],
                    drawDeck: ['Hedge Knight']
                },
                beforeMulligan() {
                    this.player1.nameCard('Eddard Stark');
                }
            });
            winPower(this, strength === 4 ? this.sansaStark : this.randyllTarly);
            if (strength === 4) {
                expect(this.player1).not.toAllowAbilityTrigger(this.thePrinceThatWasPromised);
                expect(this.hedgeKnight.location).toBe('draw deck');
            } else {
                this.player1.triggerAbility(this.thePrinceThatWasPromised);
                this.player1.clickPrompt('Stand and draw');
                expect(this.hedgeKnight.location).toBe('hand');
            }
            expect(this.player1).isReadyToTakeAction();
        });
    }
});
