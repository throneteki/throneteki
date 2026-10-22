describe('The White Book', function () {
    function setup(test, inPlay) {
        test.setupTest({
            phase: 'challenge',
            player1: { agenda: 'The White Book', inPlay: ['Ser Arys Oakheart (TC)', ...inPlay] },
            player2: { inPlay: ['Hedge Knight'] }
        });
    }

    function winOnAttack(test) {
        test.unopposedChallenge(test.player1, 'Power', test.serArysOakheart);
    }

    function winOnDefense(test) {
        test.player1.clickPrompt('Done');
        test.player2.clickPrompt('Military');
        test.player2.clickCard(test.hedgeKnight);
        test.player2.clickPrompt('Done');
        test.skipActionWindow();
        test.player1.clickCard(test.serArysOakheart);
        test.player1.clickPrompt('Done');
        test.skipActionWindow();
    }

    describe('when you do not control a King or Queen', function () {
        beforeEach(function () {
            setup(this, []);
        });

        it('does not trigger after winning on attack', function () {
            winOnAttack(this);
            expect(this.player1).not.toAllowAbilityTrigger('The White Book');
        });

        it('kneels your faction card to stand each defending Kingsguard character after winning on defense', function () {
            winOnDefense(this);
            this.player1.triggerAbility('The White Book');
            expect(this.player1Object.faction.kneeled).toBe(true);
            expect(this.serArysOakheart.kneeled).toBe(false);
        });
    });

    describe('when you control a King or Queen', function () {
        beforeEach(function () {
            setup(this, ['Jeyne Westerling']);
        });

        it('stands each attacking Kingsguard character after winning on attack', function () {
            winOnAttack(this);
            this.player1.triggerAbility('The White Book');
            expect(this.serArysOakheart.kneeled).toBe(false);
        });

        it('stands each defending Kingsguard character after winning on defense', function () {
            winOnDefense(this);
            this.player1.triggerAbility('The White Book');
            expect(this.serArysOakheart.kneeled).toBe(false);
        });
    });
});
