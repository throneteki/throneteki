describe('The Crag', function () {
    function setup(context, inPlay) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'stark',
                inPlay: ['The Crag (TSoW)', ...inPlay]
            },
            player2: {
                inPlay: ['Bastard in Hiding', 'House Maester']
            }
        });
    }

    it('stops you initiating [intrigue] challenges', function () {
        setup(this, ['Tumblestone Knight']);

        expect(this.player1).toHaveDisabledPromptButton('Intrigue');
        expect(this.player1).toHavePromptButton('Military');
        expect(this.player1).isReadyToTakeAction();
    });

    it('gains 1 power after you win a [military] challenge as the attacking player', function () {
        setup(this, ['Tumblestone Knight']);
        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        this.player1.triggerAbility(this.theCrag);
        this.player2.clickCard(this.bastardInHiding);

        expect(this.theCrag.power).toBe(1);
        expect(this.game.getPlainTextLog()).toContain(
            'player1 uses The Crag to have The Crag gain 1 power'
        );
        expect(this.player1).isReadyToTakeAction();
    });

    it('gains 2 power instead while you control a [stark] King character', function () {
        setup(this, [{ card: 'Tumblestone Knight', attachments: ['The Wolf King'] }]);
        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        this.player1.triggerAbility(this.theCrag);

        expect(this.theCrag.power).toBe(2);
    });

    it('cannot be triggered after a [power] challenge', function () {
        setup(this, ['Tumblestone Knight']);
        this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);

        expect(this.player1).not.toAllowAbilityTrigger(this.theCrag);
        expect(this.player1).isReadyToTakeAction();
    });
});
