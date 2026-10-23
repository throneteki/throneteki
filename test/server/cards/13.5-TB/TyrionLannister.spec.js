describe('Tyrion Lannister (TB)', function () {
    function bringOutTyrion(context, player1, target) {
        context.setupTest({
            phase: 'marshal',
            player1: { faction: 'lannister', shadows: ['Tyrion Lannister (TB)'], ...player1 }
        });
        context.player1.clickCard(context.tyrionLannister);
        context.player1.triggerAbility('Tyrion Lannister');
        context.player1.clickCard(target(context));
    }

    describe('when putting a card without shadow into shadows', function () {
        beforeEach(function () {
            bringOutTyrion(
                this,
                { inPlay: ['Hedge Knight'], gold: 7 },
                (context) => context.hedgeKnight
            );
        });

        it('places it in shadows with a shadow token on it', function () {
            expect(this.hedgeKnight.location).toBe('shadows');
            expect(this.hedgeKnight.tokens.shadow).toBe(1);
        });

        it('lets it come out of shadows for its printed cost', function () {
            this.player1.clickCard(this.hedgeKnight);
            expect(this.hedgeKnight.location).toBe('play area');
            expect(this.player1Object.gold).toBe(0);
        });
    });

    it('lets a limited card come out of shadows after a limited card was marshaled', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'lannister',
                shadows: ['Tyrion Lannister (TB)'],
                inPlay: ['The Roseroad'],
                hand: ['The Roseroad'],
                gold: 5
            }
        });
        const [inPlay, inHand] = [
            this.player1.findCardByName('The Roseroad', 'play area'),
            this.player1.findCardByName('The Roseroad', 'hand')
        ];
        this.player1.clickCard(inHand);
        this.player1.clickCard(this.tyrionLannister);
        this.player1.triggerAbility('Tyrion Lannister');
        this.player1.clickCard(inPlay);
        this.player1.clickCard(inPlay);
        expect(inPlay.location).toBe('play area');
    });

    it('lets a card with a lower printed shadow cost come out of shadows for that cost', function () {
        bringOutTyrion(this, { inPlay: ['Penny'], gold: 6 }, (context) => context.penny);
        this.player1.clickCard(this.penny);
        expect(this.penny.location).toBe('play area');
        expect(this.player1Object.gold).toBe(0);
    });

    it('lets a card with a higher printed shadow cost come out of shadows for its printed cost', function () {
        bringOutTyrion(this, { inPlay: ['Moqorro (DitD)'], gold: 8 }, (context) => context.moqorro);
        this.player1.clickCard(this.moqorro);
        expect(this.moqorro.location).toBe('play area');
        expect(this.player1Object.gold).toBe(0);
    });
});
