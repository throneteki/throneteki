describe('an ability whose target is checked against a game action on the chosen opponent', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Mathis Rowan', 'Hedge Knight'] }
        });
    });

    it('is offered before the opponent has been chosen', function () {
        const [action] = this.mathisRowan.abilities.actions;
        expect(action.meetsRequirements(action.createContext(this.player1Object))).toBe(true);
    });
});
