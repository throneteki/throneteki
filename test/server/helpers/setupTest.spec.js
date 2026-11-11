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

    describe('with the default plot', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    hand: ['Bran Stark (Core)']
                }
            });
        });

        it('has no text, and marshaling a Lord pays the printed cost', function () {
            expect(this.player1Object.activePlot.name).toBe('Filler Plot');
            expect(this.player1Object.activePlot.getTraits()).toEqual([]);
            expect(this.player1Object.getIncome()).toBe(5);
            expect(this.player1Object.getReserve()).toBe(6);
            expect(this.player1Object.getClaim()).toBe(1);
            expect(this.player1Object.gold).toBe(5);

            this.player1.clickCard(this.branStark);

            expect(this.branStark.location).toBe('play area');
            expect(this.player1Object.gold).toBe(3);
            expect(this.player1).isReadyToTakeAction();
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

    describe('with used plots', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { usedPlots: ['A Noble Cause', 'Trading with the Pentoshi'] }
            });
        });

        it('places them in the used pile, leaving the rest of the plot deck to choose from', function () {
            expect(this.aNobleCause.location).toBe('revealed plots');
            expect(this.tradingWithThePentoshi.location).toBe('revealed plots');
            expect(this.player1Object.getNumberOfUsedPlots()).toBe(2);
            expect(this.player1Object.plotDeck.map((card) => card.name)).toEqual([
                'Filler Plot',
                'Filler Plot',
                'Filler Plot'
            ]);
        });
    });
});

describe('setupTest with duplicates of a non-unique card', function () {
    it('throws, as only unique cards can have duplicates', function () {
        expect(() =>
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: [{ card: 'Hedge Knight', dupes: 1 }] }
            })
        ).toThrow('Hedge Knight is not unique, so it cannot have duplicates');
    });
});

describe('setupTest melee games', function () {
    it('prepares all three players and attachments owned by the third player', function () {
        this.setupTest({
            gameFormat: 'melee',
            phase: 'plot',
            player1: {
                inPlay: [
                    {
                        card: 'Hedge Knight',
                        attachments: [{ card: 'Little Bird (Core)', owner: 'player3' }]
                    }
                ]
            },
            player3: { hand: ['Milk of the Poppy'], inPlay: ['House Dayne Knight'], gold: 3 }
        });
        expect(this.game.gameFormat).toBe('melee');
        expect(this.game.getPlayers()).toHaveLength(3);
        expect(this.player3Object.hand).toEqual([this.milkOfThePoppy]);
        expect(this.houseDayneKnight.controller).toBe(this.player3Object);
        expect(this.littleBird.owner).toBe(this.player3Object);
        expect(this.littleBird.parent).toBe(this.hedgeKnight);
        expect(this.player3Object.gold).toBe(3);
        expect(this.player3).toHavePrompt('Select a plot');
    });
});
