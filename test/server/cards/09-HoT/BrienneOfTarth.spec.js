describe('Brienne of Tarth (HoT)', function () {
    it('gains 1 power after you win a challenge she is in with 6 or more STR', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Brienne of Tarth (HoT)', attachments: ['Bearskin Cloak'] }]
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.brienneOfTarth);
        this.player1.triggerAbility('Brienne of Tarth');
        expect(this.brienneOfTarth.power).toBe(1);
    });

    it('also gives another character +3 STR at 10 or more, and stands her and draws 1 card at 15 or more', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    {
                        card: 'Brienne of Tarth (HoT)',
                        attachments: [
                            "Hotah's Axe",
                            'Oathkeeper',
                            "Widow's Wail",
                            'Poisoned Dagger',
                            'Bearskin Cloak'
                        ]
                    },
                    'Hedge Knight'
                ],
                drawDeck: ['The Roseroad']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.brienneOfTarth);
        this.player1.triggerAbility('Brienne of Tarth');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.brienneOfTarth.power).toBe(1);
        expect(this.hedgeKnight.getStrength()).toBe(this.hedgeKnight.getPrintedStrength() + 3);
        expect(this.brienneOfTarth.kneeled).toBe(false);
        expect(this.theRoseroad.location).toBe('hand');
    });
});
