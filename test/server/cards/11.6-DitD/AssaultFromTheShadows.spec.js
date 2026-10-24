describe('Assault from the Shadows', function () {
    it('reduces only your plot gold by one and grants a non-shadow card its printed shadow cost', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { agenda: 'Assault from the Shadows', hand: ['Hedge Knight', 'The Roseroad'] },
            player2: { hand: ['House Maester'] }
        });
        expect(this.player1Object.activePlot.getIncome()).toBe(4);
        expect(this.player2Object.activePlot.getIncome()).toBe(5);
        expect(this.player1Object.gold).toBe(4);
        this.player1.clickCard(this.assaultFromTheShadows);
        expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
        expect(this.player1).toBeAbleToSelect(this.theRoseroad);
        expect(this.player1).not.toBeAbleToSelect(this.houseMaester);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('shadows');
        expect(this.hedgeKnight.tokens.shadow).toBe(1);
        expect(this.game.cardVisibility.isVisible(this.hedgeKnight, this.player2Object)).toBe(
            false
        );
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.hedgeKnight.isShadow()).toBe(false);
        expect(this.player1Object.gold).toBe(2);
        expect(this.player1.actionUnavailableReason(this.assaultFromTheShadows)).toBe('cost');
        expect(this.player1).isReadyToTakeAction();
    });

    it('lets a limited card come out of shadows after a limited card was marshaled', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { agenda: 'Assault from the Shadows', hand: ['The Roseroad', 'The Roseroad'] }
        });
        const roads = this.player1Object.hand.filter((card) => card.name === 'The Roseroad');
        this.player1.clickCard(this.assaultFromTheShadows);
        this.player1.clickCard(roads[1]);
        this.player1.clickCard(roads[0]);
        this.player1.clickCard(roads[1]);
        expect(roads[0].location).toBe('play area');
        expect(roads[1].location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('preserves a printed shadow cost instead of replacing it with printed cost', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { agenda: 'Assault from the Shadows', hand: ['Ser Jorah Mormont (LMHR)'] }
        });
        this.player1.clickCard(this.assaultFromTheShadows);
        this.player1.clickCard(this.serJorahMormont);
        expect(this.serJorahMormont.getShadowCost()).toBe(4);
        this.player1.clickCard(this.serJorahMormont);
        expect(this.serJorahMormont.location).toBe('play area');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('grants Hands Judgment shadow zero and cancels a cost-two event for zero gold', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { agenda: 'Assault from the Shadows', hand: ["The Hand's Judgment"] },
            player2: { hand: ['"The Last of the Giants"', 'Varys (Core)'] }
        });
        this.player1.clickCard(this.assaultFromTheShadows);
        this.player1.clickCard(this.theHandsJudgment);
        expect(this.theHandsJudgment.getShadowCost()).toBe(0);
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.theLastOfTheGiants);
        this.player2.clickCard(this.varys);
        expect(this.player1).toAllowAbilityTrigger("The Hand's Judgment");
        this.player1.triggerAbility("The Hand's Judgment");
        expect(this.varys.location).toBe('hand');
        expect(this.theHandsJudgment.location).toBe('discard pile');
        expect(this.player1Object.gold).toBe(4);
        expect(this.player2).isReadyToTakeAction();
    });

    it('cannot put a hand card into shadows outside marshaling', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { agenda: 'Assault from the Shadows', hand: ['Hedge Knight'] }
        });
        expect(this.player1.actionUnavailableReason(this.assaultFromTheShadows)).toBe('phase');
        expect(this.player1).isReadyToTakeAction();
    });
});
