describe('Tywin Lannister (LoCR)', function () {
    describe('when a single card is discarded from a deck', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'lannister',
                    inPlay: ['Tywin Lannister (LoCR)'],
                    drawDeck: ['Cersei Lannister (Core)', 'Hedge Knight']
                },
                player2: { faction: 'lannister', inPlay: ['The Tickler'] }
            });
            this.player1.togglePromptedActionWindow('dominance', true);
            this.player2.togglePromptedActionWindow('dominance', true);
            this.completeChallengesPhase();
            this.player1.clickPrompt('Pass');
            this.player2.clickMenu(this.theTickler, 'Discard opponents top card');
            this.player1.triggerAbility('Tywin Lannister');
        });

        it('instead looks at the top 2 cards of that deck and discards 1', function () {
            expect(this.player1).toBeAbleToSelect(this.cerseiLannister);
            expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
            this.player1.clickCard(this.hedgeKnight);
            expect(this.cerseiLannister.location).toBe('draw deck');
            expect(this.hedgeKnight.location).toBe('discard pile');
        });

        it('can discard the original card', function () {
            this.player1.clickCard(this.cerseiLannister);
            expect(this.cerseiLannister.location).toBe('discard pile');
            expect(this.hedgeKnight.location).toBe('draw deck');
        });
    });

    it('does not trigger when more than 1 card is discarded from a deck', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'lannister', inPlay: ['Tywin Lannister (LoCR)'] },
            player2: { faction: 'greyjoy', inPlay: ['The Reader (TRtW)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Power', this.theReader);
        this.player2.triggerAbility('The Reader');
        this.player2.clickPrompt('Discard 3 cards');
        expect(this.player1).not.toAllowAbilityTrigger('Tywin Lannister');
    });

    it('triggers for each deck when 1 card is discarded from several decks at once', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Tywin Lannister (LoCR)', { card: 'Jojen Reed', kneeling: true }],
                drawDeck: ['Cersei Lannister (Core)', 'Hedge Knight']
            },
            player2: { drawDeck: ['Burned Men', 'Winterfell Steward'] }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility('Jojen Reed');
        this.player1.clickPrompt('Discard revealed cards');
        this.player1.triggerAbility('Tywin Lannister');
        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.triggerAbility('Tywin Lannister');
        this.player1.clickCard(this.winterfellSteward);
        expect(this.cerseiLannister.location).toBe('draw deck');
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.burnedMen.location).toBe('draw deck');
        expect(this.winterfellSteward.location).toBe('discard pile');
    });

    it('triggers on pillage', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'lannister', inPlay: ['Tywin Lannister (LoCR)'] },
            player2: { drawDeck: ['Cersei Lannister (Core)', 'Hedge Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.tywinLannister);
        this.player1.triggerAbility('Tywin Lannister');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.cerseiLannister.location).toBe('draw deck');
        expect(this.hedgeKnight.location).toBe('discard pile');
    });
});
