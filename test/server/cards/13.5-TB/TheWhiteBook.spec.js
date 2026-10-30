describe('The White Book', function () {
    function setup(inPlay) {
        this.setupTest({
            phase: 'challenge',
            player1: { agenda: 'The White Book', inPlay: ['Ser Arys Oakheart (TC)', ...inPlay] },
            player2: { inPlay: ['Hedge Knight'] }
        });
    }

    function winOnAttack() {
        this.unopposedChallenge(this.player1, 'Power', this.serArysOakheart);
    }

    function winOnDefense() {
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.serArysOakheart);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    }

    describe('when you do not control a King or Queen', function () {
        beforeEach(function () {
            setup.call(this, []);
        });

        it('does not trigger after winning on attack', function () {
            winOnAttack.call(this);
            expect(this.player1).not.toAllowAbilityTrigger('The White Book');
        });

        it('kneels your faction card to stand each defending Kingsguard character after winning on defense', function () {
            winOnDefense.call(this);
            this.player1.triggerAbility('The White Book');
            expect(this.player1Object.faction.kneeled).toBe(true);
            expect(this.serArysOakheart.kneeled).toBe(false);
        });
    });

    describe('when you control a King or Queen', function () {
        beforeEach(function () {
            setup.call(this, ['Jeyne Westerling']);
        });

        it('stands each attacking Kingsguard character after winning on attack', function () {
            winOnAttack.call(this);
            this.player1.triggerAbility('The White Book');
            expect(this.serArysOakheart.kneeled).toBe(false);
        });

        it('stands each defending Kingsguard character after winning on defense', function () {
            winOnDefense.call(this);
            this.player1.triggerAbility('The White Book');
            expect(this.serArysOakheart.kneeled).toBe(false);
        });
    });
});
