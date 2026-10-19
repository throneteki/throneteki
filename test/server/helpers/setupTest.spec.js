describe('setupTest', function () {
    describe('in the default phase', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    faction: 'lannister',
                    agenda: 'Fealty',
                    inPlay: [
                        {
                            card: 'Ser Jaime Lannister (Core)',
                            kneeling: true,
                            power: 2,
                            attachments: ["Widow's Wail"]
                        },
                        { card: 'Tyrion Lannister (Core)', dupes: 1 }
                    ],
                    hand: ['Hear Me Roar!', 'Lannisport Merchant'],
                    drawDeck: ['Lannisport Merchant'],
                    discard: ['Tywin Lannister (Core)'],
                    deadPile: ['Cersei Lannister (Core)'],
                    power: 3
                },
                player2: {
                    faction: 'stark',
                    inPlay: [
                        {
                            card: 'Winterfell Steward',
                            attachments: [{ card: 'Condemned', owner: 'player1' }]
                        }
                    ],
                    hand: ["The Hand's Judgment"],
                    shadows: ['Ghost (Core)']
                }
            });
        });

        it('starts in the marshaling phase with the first player to act', function () {
            expect(this.game.currentPhase).toBe('marshal');
            expect(this.player1.firstPlayer).toBe(true);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).not.isReadyToTakeAction();
        });

        it('puts cards into play with their state', function () {
            expect(this.serJaimeLannister.location).toBe('play area');
            expect(this.serJaimeLannister.kneeled).toBe(true);
            expect(this.serJaimeLannister.power).toBe(2);
            expect(this.widowsWail.parent).toBe(this.serJaimeLannister);
            expect(this.tyrionLannister.dupes.length).toBe(1);
            expect(this.player1Object.faction.power).toBe(3);
        });

        it('attaches cards owned by another player', function () {
            expect(this.condemned.parent).toBe(this.winterfellSteward);
            expect(this.condemned.owner).toBe(this.player1Object);
        });

        it('places only the listed cards in hand', function () {
            expect(this.player1Object.hand.map((card) => card.name)).toEqual([
                'Hear Me Roar!',
                'Lannisport Merchant'
            ]);
            expect(this.player2Object.hand.map((card) => card.name)).toEqual([
                "The Hand's Judgment"
            ]);
        });

        it('puts the listed draw deck cards on top in order', function () {
            expect(this.player1Object.drawDeck[0].name).toBe('Lannisport Merchant');
            expect(this.player1Object.drawDeck[0]).not.toBe(this.lannisportMerchant);
        });

        it('places cards in the other zones', function () {
            expect(this.tywinLannister.location).toBe('discard pile');
            expect(this.cerseiLannister.location).toBe('dead pile');
            expect(this.ghost.location).toBe('shadows');
            expect(this.fealty.location).toBe('agenda');
        });
    });

    describe('in a later phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: { inPlay: ['Winterfell Steward'] },
                player2: { inPlay: ['Winterfell Steward'] }
            });
        });

        it('reaches the phase with the chosen first player', function () {
            expect(this.game.currentPhase).toBe('challenge');
            expect(this.player2.firstPlayer).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('in the plot phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { plot: 'Counting Coppers' }
            });
        });

        it('waits for plots to be chosen', function () {
            expect(this.player1).toHavePrompt('Select a plot');
            expect(this.countingCoppers.location).toBe('plot deck');
        });
    });
});
