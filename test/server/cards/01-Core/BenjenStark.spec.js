describe('Benjen Stark (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: {
                inPlay: ['Benjen Stark (Core)'],
                hand: ['Benjen Stark (Core)'],
                drawDeck: Array(10).fill('Hedge Knight')
            },
            player2: { inPlay: ['Summer (Core)'] }
        });
        this.benjen = this.player1.findCardByName('Benjen Stark', 'play area');
        this.startingPower = this.player1Object.faction.power;
        this.unopposedChallenge(this.player2, 'Military', this.summer);
        this.player1.clickCard(this.benjen);
    });

    it('gains 2 power and shuffles him back into your deck instead of your dead pile', function () {
        this.player1.triggerAbility('Benjen Stark');

        expect(this.benjen.location).toBe('draw deck');
        expect(this.player1Object.faction.power).toBe(this.startingPower + 2);
        expect(this.player2).isReadyToTakeAction();
    });

    it('does not prompt for copies in hand', function () {
        this.player1.triggerAbility('Benjen Stark');

        expect(this.player1).not.toAllowAbilityTrigger('Benjen Stark');
    });

    it('shuffles the deck after placing him in it', function () {
        this.player1.mockShuffle((cards) =>
            [...cards].sort((a) => (a.name === 'Benjen Stark' ? 1 : -1))
        );
        this.player1.triggerAbility(this.benjen);

        expect(this.player1Object.drawDeck[0]).not.toBe(this.benjen);
    });
});
