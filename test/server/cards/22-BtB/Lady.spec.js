describe('Lady (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: {
                inPlay: ['Lady (BtB)', 'Direwolf Pup', 'Sansa Stark (Core)', 'Tumblestone Knight']
            },
            player2: {
                inPlay: ['Braided Warrior']
            }
        });

        this.unopposedChallenge(this.player2, 'Military', this.braidedWarrior);
    });

    it('kills Lady to save another Direwolf card', function () {
        this.player1.clickCard(this.direwolfPup);
        this.player1.triggerAbility(this.lady);

        expect(this.direwolfPup.location).toBe('play area');
        expect(this.lady.location).toBe('dead pile');
        expect(this.game.getPlainTextLog()).toContain('player1 kills Lady to save Direwolf Pup');
        expect(this.player2).isReadyToTakeAction();
    });

    it('kills Lady to save Sansa Stark', function () {
        this.player1.clickCard(this.sansaStark);
        this.player1.triggerAbility(this.lady);

        expect(this.sansaStark.location).toBe('play area');
        expect(this.lady.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });

    it('cannot save Lady herself', function () {
        this.player1.clickCard(this.lady);

        expect(this.player1).not.toAllowAbilityTrigger(this.lady);
        expect(this.lady.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });

    it('cannot save another character', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.player1).not.toAllowAbilityTrigger(this.lady);
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
