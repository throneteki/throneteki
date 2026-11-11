describe('Varys (DitD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Varys (DitD)', 'Catspaw'], gold: 7 },
            player2: { inPlay: [{ card: 'Khal Drogo (Core)', power: 1 }] }
        });
        this.player1.clickCard(this.varys);
        this.player1.triggerAbility(this.varys);
        this.player1.clickCard(this.khalDrogo);
    });

    it('costs 1 less to bring out of shadows for each other card in shadows, and kills a character with power after he comes out of shadows', function () {
        expect(this.player1Object.gold).toBe(0);
        expect(this.khalDrogo.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Varys (DitD) discount boundaries', function () {
    for (const [otherShadows, cost] of [
        [false, 8],
        [true, 6]
    ]) {
        it('pays ' + cost + ' gold and offers no kill when no character has power', function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    shadows: otherShadows ? ['Varys (DitD)', 'Catspaw'] : ['Varys (DitD)'],
                    gold: cost
                },
                player2: {
                    shadows: otherShadows ? ['Shadow Priestess'] : [],
                    inPlay: ['Hedge Knight']
                }
            });
            this.player1.clickCard(this.varys);
            expect(this.varys.location).toBe('play area');
            expect(this.player1Object.gold).toBe(0);
            expect(this.player1).not.toAllowAbilityTrigger(this.varys);
            expect(this.hedgeKnight.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    }
});
