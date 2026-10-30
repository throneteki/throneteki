import EventTrackers from '../../../server/game/EventTrackers/index.js';

describe('ParticipationTracker', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                gold: 2,
                hand: ['Ours is the Fury'],
                inPlay: [
                    { card: 'Bastard in Hiding', kneeling: true },
                    { card: 'Ser Davos Seaworth (TTWDFL)', kneeling: true }
                ]
            },
            player2: { inPlay: ['Castle Guard', 'Tumblestone Knight'] }
        });
        this.tracker = EventTrackers.ParticipationTracker.forPhase(this.game);

        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.oursIsTheFury);
        this.player1.clickCard(this.bastardInHiding);
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('records declared attackers and characters added to the challenge by an effect', function () {
        expect(this.tracker.hasParticipated(this.castleGuard)).toBe(true);
        expect(this.tracker.hasParticipated(this.bastardInHiding)).toBe(true);
        expect(this.tracker.hasParticipated(this.serDavosSeaworth)).toBe(false);
        expect(this.tracker.hasParticipated(this.tumblestoneKnight)).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });

    it('clears when the phase ends', function () {
        this.player2.clickPrompt('Done');

        expect(this.game.currentPhase).not.toBe('challenge');
        expect(this.tracker.hasParticipated(this.castleGuard)).toBe(false);
        expect(this.tracker.hasParticipated(this.bastardInHiding)).toBe(false);
    });
});
