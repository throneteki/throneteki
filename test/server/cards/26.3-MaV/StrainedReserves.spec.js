describe('Strained Reserves', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'stark',
                plot: 'Strained Reserves (MaV)',
                gold: 10,
                hand: ['Tumblestone Knight', 'Bastard in Hiding', 'Jousting Pavilion'],
                shadows: ['House Umber Berserkers']
            },
            player2: {
                plot: 'A Song of Summer',
                gold: 10,
                hand: [
                    'House Dayne Knight',
                    'Courtesan of the Rose',
                    'Scouting Vessel',
                    'Little Bird (Core)',
                    'Grand Maester Pycelle (Core)'
                ]
            }
        });
    });

    it('stops a player marshaling more than 2 characters, locations or attachments', function () {
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.joustingPavilion);
        this.player1.clickCard(this.bastardInHiding);

        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.joustingPavilion.location).toBe('play area');
        expect(this.bastardInHiding.location).toBe('hand');
        expect(this.player1Object.gold).toBe(8);
        expect(this.player1).isReadyToTakeAction();
    });

    it('counts cards put into play, such as from shadows', function () {
        this.player1.clickCard(this.houseUmberBerserkers);
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.houseUmberBerserkers.location).toBe('play area');
        expect(this.tumblestoneKnight.location).toBe('play area');

        this.player1.clickCard(this.joustingPavilion);

        expect(this.joustingPavilion.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    it('lets a player with a Summer plot revealed marshal up to 4', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.houseDayneKnight);
        this.player2.clickCard(this.courtesanOfTheRose);
        this.player2.clickCard(this.scoutingVessel);
        this.player2.clickCard(this.littleBird);
        this.player2.clickCard(this.houseDayneKnight);
        this.player2.clickCard(this.grandMaesterPycelle);

        expect(this.houseDayneKnight.location).toBe('play area');
        expect(this.courtesanOfTheRose.location).toBe('play area');
        expect(this.scoutingVessel.location).toBe('play area');
        expect(this.littleBird.parent).toBe(this.houseDayneKnight);
        expect(this.grandMaesterPycelle.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});

describe("Strained Reserves with a card from an opponent's discard pile", function () {
    function setup(context, player1Hand) {
        context.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'greyjoy',
                plot: 'Strained Reserves (MaV)',
                gold: 10,
                hand: player1Hand,
                inPlay: ["Euron Crow's Eye (Core)"]
            },
            player2: {
                gold: 10,
                hand: ['Bastard in Hiding', 'Put to the Torch', 'Hedge Knight'],
                inPlay: ['Ser Jaime Lannister (Core)'],
                drawDeck: ['The Arbor']
            }
        });
        for (const card of player1Hand) {
            context.player1.clickCard(context.player1.findCardByName(card, 'hand'));
        }
        context.player1.clickPrompt('Done');
        context.player2.clickCard(context.bastardInHiding);
        context.player2.clickPrompt('Done');
        context.unopposedChallenge(context.player1, 'Power', context.euronCrowsEye);
        context.theArbor = context.player2.findCardByName('The Arbor', 'discard pile');
    }

    it('counts against the player who puts it into play, so they cannot exceed their limit', function () {
        setup(this, ['Tumblestone Knight', 'Winterfell Steward']);

        expect(this.player1).not.toAllowAbilityTrigger(this.euronCrowsEye);
        expect(this.theArbor.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it("does not count against its owner once it leaves the other player's control", function () {
        setup(this, ['Tumblestone Knight']);
        this.player1.triggerAbility(this.euronCrowsEye);
        this.player1.clickCard(this.theArbor);

        expect(this.theArbor.controller).toBe(this.player1Object);

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player2.triggerAbility('Put to the Torch');
        this.player2.clickCard(this.theArbor);

        expect(this.theArbor.location).toBe('discard pile');
        expect(this.player2Object.canPutIntoPlay(this.hedgeKnight, 'ambush')).toBe(true);

        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.player2).isReadyToTakeAction();
    });

    describe('when a player marshals a duplicate', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    plot: 'Strained Reserves (MaV)',
                    gold: 10,
                    inPlay: ['Arya Stark (Core)'],
                    hand: [
                        'Arya Stark (Core)',
                        'Arya Stark (Core)',
                        'Tumblestone Knight',
                        'Hedge Knight',
                        'Winterfell Steward'
                    ]
                }
            });
            this.aryaInPlay = this.player1.findCardByName('Arya Stark', 'play area');
            [this.firstDupe, this.secondDupe] = this.player1.filterCardsByName(
                'Arya Stark',
                'hand'
            );
        });

        it('neither counts it towards the limit nor stops it once the limit is reached', function () {
            this.player1.clickCard(this.firstDupe);
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickCard(this.winterfellSteward);
            this.player1.clickCard(this.secondDupe);

            expect(this.firstDupe.location).toBe('duplicate');
            expect(this.tumblestoneKnight.location).toBe('play area');
            expect(this.hedgeKnight.location).toBe('play area');
            expect(this.winterfellSteward.location).toBe('hand');
            expect(this.secondDupe.location).toBe('duplicate');
            expect(this.aryaInPlay.dupes).toHaveLength(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
