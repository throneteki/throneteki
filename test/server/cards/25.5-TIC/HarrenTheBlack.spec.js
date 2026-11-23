describe('Harren the Black', function () {
    it('stops each opponent marshaling copies of locations in their discard pile', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: [{ card: 'Pyke (BtB)', attachments: ['Harren the Black'] }]
            },
            player2: { hand: ['The Roseroad', 'The Kingsroad'], discard: ['The Roseroad'] }
        });
        const [roseroadInHand] = this.player2.filterCardsByName('The Roseroad', 'hand');
        expect(this.player2Object.canPutIntoPlay(roseroadInHand, 'marshal')).toBe(false);
        expect(this.player2Object.canPutIntoPlay(this.theKingsroad, 'marshal')).toBe(true);
    });

    it('discards the top card of each deck after a character you control discards a card using pillage', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: [
                    { card: 'Pyke (BtB)', attachments: ['Harren the Black'] },
                    "Black Wind's Crew"
                ],
                drawDeck: ['Hedge Knight']
            },
            player2: { drawDeck: ['Castle Guard', 'Winterfell Steward'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.blackWindsCrew);
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('discard pile');
        expect(this.hedgeKnight.location).toBe('discard pile');
    });

    it('stops each opponent marshaling a copy of a location in their discard pile as a duplicate', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'greyjoy',
                inPlay: [{ card: 'Pyke (BtB)', attachments: ['Harren the Black'] }]
            },
            player2: {
                faction: 'baratheon',
                inPlay: ['The Red Keep (Core)'],
                hand: ['The Red Keep (Core)'],
                discard: ['The Red Keep (Core)']
            }
        });
        const redKeepInHand = this.player2.findCardByName('The Red Keep', 'hand');
        this.player1.clickPrompt('Done');

        this.player2.clickCard(redKeepInHand);

        expect(redKeepInHand.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
