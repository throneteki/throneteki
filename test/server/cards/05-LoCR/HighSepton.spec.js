describe('High Septon', function () {
    function setup(context, player2 = {}) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'stark',
                inPlay: ['High Septon', 'House Tully Septon', 'Winterfell Steward']
            },
            player2: { faction: 'targaryen', inPlay: ['Mirri Maz Duur'], ...player2 }
        });
        context.player1.clickPrompt('Done');
    }

    describe('vs a single target ability', function () {
        beforeEach(function () {
            setup(this);
            this.unopposedChallenge(this.player2, 'Intrigue', this.mirriMazDuur);
            this.player2.triggerAbility('Mirri Maz Duur');
        });

        it('redirects it to a The Seven character you control', function () {
            this.player2.clickCard(this.highSepton);
            this.player1.triggerAbility('High Septon');
            expect(this.player1).not.toBeAbleToSelect(this.winterfellSteward);
            this.player1.clickCard(this.houseTullySepton);
            expect(this.houseTullySepton.location).toBe('dead pile');
            expect(this.highSepton.location).toBe('play area');
        });
    });

    it('cannot redirect an ability that does not target', function () {
        setup(this, { hand: ['Tears of Lys'], gold: 1 });
        this.unopposedChallenge(this.player2, 'Intrigue', this.mirriMazDuur);
        this.player2.triggerAbility('Tears of Lys');
        this.player2.clickCard(this.winterfellSteward);
        expect(this.player1).not.toAllowAbilityTrigger('High Septon');
    });

    it('cannot redirect an ability with more than one target', function () {
        setup(this, { hand: ['Even Handed Justice'], gold: 2 });
        this.player2.clickCard(this.evenHandedJustice);
        this.player2.clickCard(this.mirriMazDuur);
        this.player2.clickCard(this.highSepton);
        expect(this.player1).not.toAllowAbilityTrigger('High Septon');
    });
});
