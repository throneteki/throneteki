describe('Ser Gregor Clegane (TKP)', function () {
    function setup(drawDeck) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Gregor Clegane (TKP)'] },
            player2: { drawDeck, inPlay: ['Bastard in Hiding', 'Castle Guard'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serGregorClegane);
        this.player2.clickCard(this.castleGuard);
    }

    it('discards a non-character as normal', function () {
        setup.call(this, ['The Roseroad']);
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.player1).not.toAllowAbilityTrigger('Ser Gregor Clegane');
    });

    it('places a pillaged character in the dead pile, then may kill a character with the same printed cost', function () {
        setup.call(this, ['Hedge Knight']);
        this.player1.triggerAbility('Ser Gregor Clegane');
        expect(this.hedgeKnight.location).toBe('dead pile');
        this.player1.clickCard(this.bastardInHiding);
        expect(this.bastardInHiding.location).toBe('dead pile');
    });

    it('places a pillaged character in the dead pile without a kill prompt when no character has its printed cost', function () {
        setup.call(this, ['Maester Cressen (Core)']);
        this.player1.triggerAbility('Ser Gregor Clegane');
        expect(this.maesterCressen.location).toBe('dead pile');
        expect(this.player1).not.toHavePrompt('Select a character');
    });
});

describe("Ser Gregor Clegane (TKP) with Nagga's Ribs", function () {
    it('offers both reactions to the pillaged character in one window', function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['Ser Gregor Clegane (TKP)'] },
            player2: {
                drawDeck: ['Hedge Knight'],
                inPlay: ["Nagga's Ribs", 'Bastard in Hiding', 'Castle Guard']
            }
        });
        this.player2.clickPrompt('Done');
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.serGregorClegane);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.castleGuard);

        expect(this.player2).toAllowAbilityTrigger("Nagga's Ribs");

        this.player2.clickPrompt('Pass');
        this.player1.triggerAbility('Ser Gregor Clegane');
        this.player1.clickCard(this.bastardInHiding);

        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.bastardInHiding.location).toBe('dead pile');
    });
});
