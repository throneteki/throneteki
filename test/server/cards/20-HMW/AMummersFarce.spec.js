describe("A Mummer's Farce", function () {
    function setup({ jinglebell = 'Jinglebell (HMW)', inPlay = [], hand = [] } = {}) {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                agenda: "A Mummer's Farce",
                inPlay: [jinglebell, ...inPlay],
                hand,
                drawDeck: ['Green-Apple Knight']
            }
        });
        this.facedownKnight = this.player1.findCardByName('Green-Apple Knight', 'draw deck');
        this.unopposedChallenge(this.player1, 'Intrigue', this.jinglebell);
        this.completeChallengesPhase();
    }

    function nextMarshalPhase() {
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    }

    describe('after a Fool character you control stands', function () {
        beforeEach(function () {
            setup.call(this, { inPlay: ['Green-Apple Knight'] });
            this.knight = this.player1.findCardByName('Green-Apple Knight', 'play area');
        });

        it('attaches the top card of your deck facedown to it as a Terminal Weapon that gives +1 STR', function () {
            expect(this.facedownKnight.parent).toBe(this.jinglebell);
            expect(this.facedownKnight.facedown).toBe(true);
            expect(this.facedownKnight.getType()).toBe('attachment');
            expect(this.facedownKnight.isTerminal()).toBe(true);
            expect(this.facedownKnight.hasTrait('Weapon')).toBe(true);
            expect(this.jinglebell.getStrength()).toBe(2);
        });

        it('lets you marshal the facedown card, which then applies its own effects', function () {
            nextMarshalPhase.call(this);
            this.player1.clickCard(this.facedownKnight);
            expect(this.facedownKnight.location).toBe('play area');
            expect(this.facedownKnight.parent).toBeUndefined();
            expect(this.facedownKnight.facedown).toBe(false);
            expect(this.jinglebell.getStrength()).toBe(1);
            expect(this.knight.getStrength()).toBe(2);
            expect(this.facedownKnight.getStrength()).toBe(2);
        });
    });

    describe('when a Fool with a Weapon and a facedown attachment gains a no attachments keyword', function () {
        beforeEach(function () {
            setup.call(this, {
                jinglebell: { card: 'Jinglebell (HMW)', attachments: ['Warhammer'] },
                hand: ['Blessed by the Maiden']
            });
            this.warhammer = this.player1.findCardByName('Warhammer', 'play area');
        });

        it('discards the attachments that are no longer valid', function () {
            expect(this.jinglebell.getStrength()).toBe(4);
            nextMarshalPhase.call(this);
            this.player1.clickCard(this.blessedByTheMaiden);
            this.player1.clickCard(this.jinglebell);
            this.player1.clickPrompt('Done');
            expect(this.jinglebell.getStrength()).toBe(1);
            expect(this.facedownKnight.location).toBe('discard pile');
            expect(this.warhammer.location).toBe('discard pile');
        });
    });
});
