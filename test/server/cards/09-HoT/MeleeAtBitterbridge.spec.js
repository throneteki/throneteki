describe('Melee at Bitterbridge', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Jon Fossoway'], hand: ['Melee at Bitterbridge'], gold: 5 },
            player2: { inPlay: ['Arbor Knight', 'Arbor Knight'] }
        });
        [this.knight1, this.knight2] = this.player2.filterCardsByName('Arbor Knight', 'play area');
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.serJonFossoway);
        this.player1.clickPrompt('Done');
    });

    it('gives renown to a single chosen character', function () {
        this.player1.clickCard(this.meleeAtBitterbridge);
        this.player1.clickCard(this.serJonFossoway);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.serJonFossoway.power).toBe(1);
    });

    it('gives renown to the highest STR chosen character and has the others not contribute STR', function () {
        this.skipActionWindow();
        this.player2.clickCard(this.knight1);
        this.player2.clickCard(this.knight2);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.meleeAtBitterbridge);
        this.player1.selectValue('3');
        this.player1.clickCard(this.serJonFossoway);
        this.player1.clickCard(this.knight1);
        this.player1.clickCard(this.knight2);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        expect(this.player1Object.faction.power).toBe(1);
        expect(this.serJonFossoway.power).toBe(1);
    });
});
