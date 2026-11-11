describe('King at the Wall', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'baratheon',
                inPlay: [
                    { card: 'Stannis Baratheon (Core)', attachments: ['King at the Wall'] },
                    'Casterly Rock (Core)',
                    'The Roseroad'
                ],
                drawDeck: ['Castle Guard', 'Winterfell Steward']
            }
        });
        this.unopposedChallenge(this.player1, 'Power', this.stannisBaratheon);
        this.player1.triggerAbility('King at the Wall');
    });

    it('draws 1 card for each out-of-faction location you control', function () {
        expect(this.stannisBaratheon.hasTrait('King')).toBe(true);
        expect(this.player1Object.hand.length).toBe(1);
    });
});
