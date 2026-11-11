describe('Ser Davos Seaworth (GoH)', function () {
    function setup(defender) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Davos Seaworth (GoH)'], gold: 0 },
            player2: { inPlay: [defender] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.serDavosSeaworth);
        this.player1.clickPrompt('Done');
    }

    describe('after bypassing a non-loyal character using stealth', function () {
        beforeEach(function () {
            setup.call(this, 'Hedge Knight');
            this.player1.clickCard(this.hedgeKnight);
            this.player1.triggerAbility('Ser Davos Seaworth');
        });

        it('lets you draw 1 card', function () {
            const handSize = this.player1Object.hand.length;
            this.player1.clickPrompt('Draw 1 card');
            expect(this.player1Object.hand.length).toBe(handSize + 1);
        });

        it('or gain 1 gold', function () {
            this.player1.clickPrompt('Gain 1 gold');
            expect(this.player1Object.gold).toBe(1);
        });
    });

    it('does not trigger after bypassing a loyal character', function () {
        setup.call(this, 'Samwell Tarly (Core)');
        this.player1.clickCard(this.samwellTarly);
        expect(this.player1).not.toAllowAbilityTrigger('Ser Davos Seaworth');
    });
});
