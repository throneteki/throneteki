import EventTrackers from '../../../server/game/EventTrackers/index.js';

describe('CardEntersPlayTracker', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["Euron Crow's Eye (Core)"] },
            player2: {
                hand: ['Put to the Torch'],
                inPlay: ['Ser Jaime Lannister (Core)'],
                drawDeck: ['The Arbor']
            }
        });
        this.tracker = EventTrackers.CardEntersPlayTracker.forRound(this.game);
        this.unopposedChallenge(this.player1, 'Power', this.euronCrowsEye);
        this.theArbor = this.player2.findCardByName('The Arbor', 'discard pile');
        this.player1.triggerAbility(this.euronCrowsEye);
        this.player1.clickCard(this.theArbor);
        this.entersPlayEvent = this.tracker.events.find((event) => event.card === this.theArbor);
    });

    it('records the player a card entered play under', function () {
        expect(this.tracker.controllerOnEntry(this.entersPlayEvent)).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });

    it('keeps that player after the card leaves play and returns to its owner', function () {
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player2.triggerAbility('Put to the Torch');
        this.player2.clickCard(this.theArbor);
        this.player1.clickCard(this.euronCrowsEye);

        expect(this.theArbor.controller).toBe(this.player2Object);
        expect(this.tracker.controllerOnEntry(this.entersPlayEvent)).toBe(this.player1Object);
        expect(this.player2).isReadyToTakeAction();
    });
});
