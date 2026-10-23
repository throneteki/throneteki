describe('Overwhelming Numbers', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                inPlay: ['Braided Warrior', 'Braided Warrior'],
                hand: ['Overwhelming Numbers', 'Braided Warrior'],
                discard: ['Khal Drogo (Core)'],
                gold: 2
            }
        });
        [this.attacker1, this.attacker2] = this.player1.filterCardsByName(
            'Braided Warrior',
            'play area'
        );
        this.fromHand = this.player1.findCardByName('Braided Warrior', 'hand');
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.attacker1);
        this.player1.clickCard(this.attacker2);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.overwhelmingNumbers);
        this.player1.clickCard(this.fromHand);
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
    });

    it('puts up to 2 Dothraki characters into play from your hand or discard pile knelt, participating as attackers', function () {
        for (const card of [this.fromHand, this.khalDrogo]) {
            expect(card.location).toBe('play area');
            expect(card.kneeled).toBe(true);
            expect(card.isAttacking()).toBe(true);
        }
    });

    it('returns them to your hand at the end of the challenge', function () {
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.fromHand.location).toBe('hand');
        expect(this.khalDrogo.location).toBe('hand');
    });
});
